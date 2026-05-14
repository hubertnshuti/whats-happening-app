package com.whatshappening.backend.dto.notification;

import com.whatshappening.backend.entity.Notification;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationResponse {
    private UUID id;
    private String type;
    private String title;
    private String message;
    private String link;
    private UUID relatedEventId;
    private String eventSlug;
    private boolean read;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType().name())
                .title(n.getTitle())
                .message(n.getBody())
                .link(n.getLinkUrl())
                .relatedEventId(n.getRelatedEvent() != null ? n.getRelatedEvent().getId() : null)
                .eventSlug(n.getRelatedEvent() != null ? n.getRelatedEvent().getSlug() : null)
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}