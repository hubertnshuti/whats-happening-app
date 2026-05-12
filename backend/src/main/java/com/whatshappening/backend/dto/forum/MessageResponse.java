package com.whatshappening.backend.dto.forum;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class MessageResponse {
    private UUID id;
    private String content;
    private String messageType;
    private boolean pinned;
    private UUID authorId;
    private String authorName;
    private Map<String, Long> reactions;   // emoji -> count
    private LocalDateTime editedAt;
    private LocalDateTime createdAt;
}