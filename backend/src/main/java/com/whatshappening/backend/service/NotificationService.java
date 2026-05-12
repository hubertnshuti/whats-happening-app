package com.whatshappening.backend.service;

import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.notification.NotificationResponse;
import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.entity.Notification;
import com.whatshappening.backend.entity.User;
import com.whatshappening.backend.exception.ResourceNotFoundException;
import com.whatshappening.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notify(User recipient, Notification.Type type, String title, String body, String linkUrl, Event relatedEvent) {
        Notification n = Notification.builder()
                .recipient(recipient)
                .type(type)
                .title(title)
                .body(body)
                .linkUrl(linkUrl)
                .relatedEvent(relatedEvent)
                .build();
        notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public PageResponse<NotificationResponse> list(User user, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50));
        return PageResponse.from(
                notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable),
                NotificationResponse::from
        );
    }

    @Transactional(readOnly = true)
    public long unreadCount(User user) {
        return notificationRepository.countByRecipientAndReadFalse(user);
    }

    @Transactional
    public void markRead(UUID id, User user) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!n.getRecipient().getId().equals(user.getId())) {
            throw new com.whatshappening.backend.exception.ApiException("Not your notification", HttpStatus.FORBIDDEN);
        }
        if (!n.isRead()) {
            n.setRead(true);
            n.setReadAt(LocalDateTime.now());
        }
    }

    @Transactional
    public void markAllRead(User user) {
        notificationRepository.markAllReadForUser(user);
    }
}