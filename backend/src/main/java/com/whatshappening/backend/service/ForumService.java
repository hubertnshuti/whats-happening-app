package com.whatshappening.backend.service;

import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.forum.*;
import com.whatshappening.backend.entity.*;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.exception.ResourceNotFoundException;
import com.whatshappening.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
//for notifications
import com.whatshappening.backend.repository.UserRepository;
import com.whatshappening.backend.entity.Notification;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final EventRepository eventRepository;
    private final EventForumRepository forumRepository;
    private final ForumMemberRepository memberRepository;
    private final ForumMessageRepository messageRepository;
    private final MessageReactionRepository reactionRepository;
    private final ForumQuestionRepository questionRepository;

//    for notifications
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // Called by EventService when an event is published
    @Transactional
    public EventForum ensureForumForEvent(Event event) {
        return forumRepository.findByEvent(event).orElseGet(() -> {
            EventForum f = EventForum.builder()
                    .event(event)
                    .status(EventForum.Status.ACTIVE)
                    .memberCount(1)
                    .lastActivityAt(LocalDateTime.now())
                    .build();
            EventForum saved = forumRepository.save(f);
            // Organizer auto-joins as admin
            ForumMember organizerMember = ForumMember.builder()
                    .id(new ForumMemberId(saved.getId(), event.getOrganizer().getId()))
                    .forum(saved)
                    .user(event.getOrganizer())
                    .role(ForumMember.Role.ADMIN)
                    .build();
            memberRepository.save(organizerMember);
            return saved;
        });
    }

    @Transactional
    public ForumResponse getForumForEvent(UUID eventId, User currentUser) {
        EventForum forum = forumRepository.findByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum not found"));
        boolean isOrganizer = currentUser != null &&
                forum.getEvent().getOrganizer().getId().equals(currentUser.getId());
        boolean isMember = currentUser != null && memberRepository.existsByForumAndUser(forum, currentUser);

        // Auto-enroll organizer as ADMIN if they're somehow missing from forum_members
        if (isOrganizer && !isMember) {
            ForumMember organizerMember = ForumMember.builder()
                    .id(new ForumMemberId(forum.getId(), currentUser.getId()))
                    .forum(forum)
                    .user(currentUser)
                    .role(ForumMember.Role.ADMIN)
                    .build();
            memberRepository.save(organizerMember);
            forum.setMemberCount(forum.getMemberCount() + 1);
            isMember = true;
        }

        return ForumResponse.from(forum, isMember, isOrganizer);
    }

    @Transactional
    public ForumResponse joinForum(UUID eventId, User user) {
        EventForum forum = requireActiveForum(eventId);

        boolean isOrganizer = forum.getEvent().getOrganizer().getId().equals(user.getId());
        if (memberRepository.existsByForumAndUser(forum, user)) {
            return ForumResponse.from(forum, true, isOrganizer);
        }

        ForumMember member = ForumMember.builder()
                .id(new ForumMemberId(forum.getId(), user.getId()))
                .forum(forum)
                .user(user)
                .role(isOrganizer ? ForumMember.Role.ADMIN : ForumMember.Role.MEMBER)
                .build();
        memberRepository.save(member);
        forum.setMemberCount(forum.getMemberCount() + 1);
        return ForumResponse.from(forum, true, isOrganizer);
    }

    @Transactional
    public void leaveForum(UUID eventId, User user) {
        EventForum forum = forumRepository.findByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum not found"));
        if (forum.getEvent().getOrganizer().getId().equals(user.getId())) {
            throw new ApiException("Organizer cannot leave their own forum", HttpStatus.BAD_REQUEST);
        }
        if (memberRepository.existsByForumAndUser(forum, user)) {
            memberRepository.deleteByForumAndUser(forum, user);
            forum.setMemberCount(Math.max(0, forum.getMemberCount() - 1));
        }
    }

    @Transactional
    public MessageResponse postMessage(UUID eventId, CreateMessageRequest req, User author) {
        EventForum forum = requireActiveForum(eventId);
        ensureForumAdmin(forum, author);

        ForumMessage message = ForumMessage.builder()
                .forum(forum)
                .author(author)
                .messageType(req.getMessageType() != null ? req.getMessageType() : ForumMessage.Type.GENERAL)
                .content(req.getContent())
                .pinned(Boolean.TRUE.equals(req.getPinned()))
                .build();
        ForumMessage saved = messageRepository.save(message);
        forum.setLastActivityAt(LocalDateTime.now());

//        this code block before return statement is for notification

        String linkUrl = "/events/" + forum.getEvent().getSlug() + "/forum";
        for (ForumMember m : memberRepository.findByForumAndNotificationsEnabledTrue(forum)) {
            if (!m.getUser().getId().equals(author.getId())) { // don't notify yourself
                notificationService.notify(
                        m.getUser(),
                        Notification.Type.FORUM_MESSAGE,
                        "New " + saved.getMessageType().name().toLowerCase().replace('_', ' ') + " for " + forum.getEvent().getTitle(),
                        saved.getContent().length() > 200 ? saved.getContent().substring(0, 200) + "…" : saved.getContent(),
                        linkUrl,
                        forum.getEvent()
                );
            }
        }


        return toMessageResponse(saved);
    }

    @Transactional
    public void deleteMessage(UUID messageId, User currentUser) {
        ForumMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        boolean isAuthor = message.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("MODERATOR") || r.getName().equals("SUPER_ADMIN"));
        if (!isAuthor && !isAdmin) {
            throw new ApiException("Not allowed to delete this message", HttpStatus.FORBIDDEN);
        }
        message.setDeletedAt(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public PageResponse<MessageResponse> listMessages(UUID eventId, int page, int size) {
        EventForum forum = forumRepository.findByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum not found"));
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50));
        return PageResponse.from(
                messageRepository.findByForumAndDeletedAtIsNullOrderByCreatedAtDesc(forum, pageable),
                this::toMessageResponse
        );
    }

    @Transactional
    public Map<String, Long> toggleReaction(UUID messageId, ReactionRequest req, User user) {
        ForumMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        MessageReactionId id = new MessageReactionId(message.getId(), user.getId(), req.getEmoji());
        if (reactionRepository.existsById(id)) {
            reactionRepository.deleteById(id);
        } else {
            MessageReaction reaction = MessageReaction.builder()
                    .id(id)
                    .message(message)
                    .user(user)
                    .build();
            reactionRepository.save(reaction);
        }
        return countReactions(message);
    }

    @Transactional
    public QuestionResponse askQuestion(UUID eventId, QuestionRequest req, User asker) {
        EventForum forum = requireActiveForum(eventId);
        if (!memberRepository.existsByForumAndUser(forum, asker)) {
            throw new ApiException("Join the forum to ask a question", HttpStatus.FORBIDDEN);
        }
        ForumQuestion q = ForumQuestion.builder()
                .forum(forum)
                .asker(asker)
                .question(req.getQuestion())
                .build();
        ForumQuestion saved = questionRepository.save(q);
        forum.setLastActivityAt(LocalDateTime.now());

        // Notify the event organizer
        User organizer = forum.getEvent().getOrganizer();
        if (!organizer.getId().equals(asker.getId())) {
            notificationService.notify(
                    organizer,
                    Notification.Type.FORUM_MESSAGE,
                    asker.getFullName() + " asked a question in " + forum.getEvent().getTitle(),
                    req.getQuestion().length() > 200 ? req.getQuestion().substring(0, 200) + "…" : req.getQuestion(),
                    "/events/" + forum.getEvent().getSlug() + "/forum",
                    forum.getEvent()
            );
        }

        return toQuestionResponse(saved);
    }

    @Transactional
    public QuestionResponse answerQuestion(UUID questionId, AnswerRequest req, User answerer) {
        ForumQuestion q = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        ensureForumAdmin(q.getForum(), answerer);

        q.setAnswer(req.getAnswer());
        q.setAnsweredBy(answerer);
        q.setAnsweredAt(LocalDateTime.now());
        q.setStatus(ForumQuestion.Status.ANSWERED);
        q.getForum().setLastActivityAt(LocalDateTime.now());

//        this code block is for notifications

        notificationService.notify(
                q.getAsker(),
                Notification.Type.FORUM_QUESTION_ANSWERED,
                "Your question was answered",
                req.getAnswer().length() > 200 ? req.getAnswer().substring(0, 200) + "…" : req.getAnswer(),
                "/events/" + q.getForum().getEvent().getSlug() + "/forum",
                q.getForum().getEvent()
        );

        return toQuestionResponse(q);
    }

    @Transactional(readOnly = true)
    public PageResponse<QuestionResponse> listQuestions(UUID eventId, int page, int size) {
        EventForum forum = forumRepository.findByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum not found"));
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50));
        return PageResponse.from(
                questionRepository.findByForumOrderByCreatedAtDesc(forum, pageable),
                this::toQuestionResponse
        );
    }

    // ===== helpers =====

    private EventForum requireActiveForum(UUID eventId) {
        EventForum forum = forumRepository.findByEventId(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum not found"));
        if (forum.getStatus() != EventForum.Status.ACTIVE) {
            throw new ApiException("Forum is " + forum.getStatus() + " and not accepting changes", HttpStatus.BAD_REQUEST);
        }
        return forum;
    }

    private void ensureForumAdmin(EventForum forum, User user) {
        boolean isOrganizer = forum.getEvent().getOrganizer().getId().equals(user.getId());
        boolean isPrivileged = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN") || r.getName().equals("MODERATOR") || r.getName().equals("SUPER_ADMIN"));
        if (!isOrganizer && !isPrivileged) {
            throw new ApiException("Only the organizer can do this", HttpStatus.FORBIDDEN);
        }
    }

    private MessageResponse toMessageResponse(ForumMessage m) {
        return MessageResponse.builder()
                .id(m.getId())
                .content(m.getContent())
                .messageType(m.getMessageType().name())
                .pinned(m.isPinned())
                .authorId(m.getAuthor().getId())
                .authorName(m.getAuthor().getFullName())
                .reactions(countReactions(m))
                .editedAt(m.getEditedAt())
                .createdAt(m.getCreatedAt())
                .build();
    }

    private Map<String, Long> countReactions(ForumMessage message) {
        List<MessageReaction> reactions = reactionRepository.findByMessage(message);
        Map<String, Long> counts = new HashMap<>();
        for (MessageReaction r : reactions) {
            counts.merge(r.getId().getEmoji(), 1L, Long::sum);
        }
        return counts;
    }

    private QuestionResponse toQuestionResponse(ForumQuestion q) {
        return QuestionResponse.builder()
                .id(q.getId())
                .question(q.getQuestion())
                .answer(q.getAnswer())
                .askerName(q.getAsker().getFullName())
                .answeredByName(q.getAnsweredBy() != null ? q.getAnsweredBy().getFullName() : null)
                .answeredAt(q.getAnsweredAt())
                .status(q.getStatus().name())
                .createdAt(q.getCreatedAt())
                .build();
    }
}