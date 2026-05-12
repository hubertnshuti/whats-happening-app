package com.whatshappening.backend.dto.forum;

import com.whatshappening.backend.entity.EventForum;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class ForumResponse {
    private UUID id;
    private UUID eventId;
    private String eventTitle;
    private String status;
    private int memberCount;
    private LocalDateTime lastActivityAt;
    private boolean isMember;

    public static ForumResponse from(EventForum f, boolean isMember) {
        return ForumResponse.builder()
                .id(f.getId())
                .eventId(f.getEvent().getId())
                .eventTitle(f.getEvent().getTitle())
                .status(f.getStatus().name())
                .memberCount(f.getMemberCount())
                .lastActivityAt(f.getLastActivityAt())
                .isMember(isMember)
                .build();
    }
}