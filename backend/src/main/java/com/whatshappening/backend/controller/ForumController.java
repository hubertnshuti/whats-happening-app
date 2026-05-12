package com.whatshappening.backend.controller;

import com.whatshappening.backend.dto.common.ApiResponse;
import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.forum.*;
import com.whatshappening.backend.entity.User;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.repository.UserRepository;
import com.whatshappening.backend.service.ForumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final UserRepository userRepository;

    @GetMapping("/events/{eventId}/forum")
    public ResponseEntity<ApiResponse<ForumResponse>> getForum(@PathVariable UUID eventId, Authentication auth) {
        User user = optionalUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Forum retrieved", forumService.getForumForEvent(eventId, user)));
    }

    @PostMapping("/events/{eventId}/forum/join")
    public ResponseEntity<ApiResponse<ForumResponse>> join(@PathVariable UUID eventId, Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Joined forum", forumService.joinForum(eventId, user)));
    }

    @PostMapping("/events/{eventId}/forum/leave")
    public ResponseEntity<ApiResponse<Object>> leave(@PathVariable UUID eventId, Authentication auth) {
        User user = requireUser(auth);
        forumService.leaveForum(eventId, user);
        return ResponseEntity.ok(ApiResponse.success("Left forum"));
    }

    @GetMapping("/events/{eventId}/forum/messages")
    public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>> listMessages(
            @PathVariable UUID eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved", forumService.listMessages(eventId, page, size)));
    }

    @PostMapping("/events/{eventId}/forum/messages")
    public ResponseEntity<ApiResponse<MessageResponse>> postMessage(
            @PathVariable UUID eventId,
            @Valid @RequestBody CreateMessageRequest req,
            Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message posted", forumService.postMessage(eventId, req, user)));
    }

    @DeleteMapping("/forum/messages/{messageId}")
    public ResponseEntity<ApiResponse<Object>> deleteMessage(@PathVariable UUID messageId, Authentication auth) {
        User user = requireUser(auth);
        forumService.deleteMessage(messageId, user);
        return ResponseEntity.ok(ApiResponse.success("Message deleted"));
    }

    @PostMapping("/forum/messages/{messageId}/reactions")
    public ResponseEntity<ApiResponse<Map<String, Long>>> toggleReaction(
            @PathVariable UUID messageId,
            @Valid @RequestBody ReactionRequest req,
            Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Reaction toggled", forumService.toggleReaction(messageId, req, user)));
    }

    @GetMapping("/events/{eventId}/forum/questions")
    public ResponseEntity<ApiResponse<PageResponse<QuestionResponse>>> listQuestions(
            @PathVariable UUID eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Questions retrieved", forumService.listQuestions(eventId, page, size)));
    }

    @PostMapping("/events/{eventId}/forum/questions")
    public ResponseEntity<ApiResponse<QuestionResponse>> askQuestion(
            @PathVariable UUID eventId,
            @Valid @RequestBody QuestionRequest req,
            Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Question submitted", forumService.askQuestion(eventId, req, user)));
    }

    @PostMapping("/forum/questions/{questionId}/answer")
    public ResponseEntity<ApiResponse<QuestionResponse>> answerQuestion(
            @PathVariable UUID questionId,
            @Valid @RequestBody AnswerRequest req,
            Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Question answered", forumService.answerQuestion(questionId, req, user)));
    }

    private User requireUser(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new ApiException("Not authenticated", HttpStatus.UNAUTHORIZED);
        }
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED));
    }

    private User optionalUser(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null || "anonymousUser".equals(auth.getPrincipal())) return null;
        try {
            String email = ((UserDetails) auth.getPrincipal()).getUsername();
            return userRepository.findByEmail(email).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }
}