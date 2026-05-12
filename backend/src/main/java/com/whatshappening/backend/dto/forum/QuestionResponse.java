package com.whatshappening.backend.dto.forum;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class QuestionResponse {
    private UUID id;
    private String question;
    private String answer;
    private String askerName;
    private String answeredByName;
    private LocalDateTime answeredAt;
    private String status;
    private LocalDateTime createdAt;
}