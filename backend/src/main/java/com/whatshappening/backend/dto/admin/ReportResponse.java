package com.whatshappening.backend.dto.admin;

import com.whatshappening.backend.entity.EventReport;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class ReportResponse {
    private UUID id;
    private UUID eventId;
    private String eventTitle;
    private String reporterName;
    private String reason;
    private String details;
    private String status;
    private String reviewedByName;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;

    public static ReportResponse from(EventReport r) {
        return ReportResponse.builder()
                .id(r.getId())
                .eventId(r.getEvent().getId())
                .eventTitle(r.getEvent().getTitle())
                .reporterName(r.getReporter().getFullName())
                .reason(r.getReason())
                .details(r.getDetails())
                .status(r.getStatus().name())
                .reviewedByName(r.getReviewedBy() != null ? r.getReviewedBy().getFullName() : null)
                .reviewedAt(r.getReviewedAt())
                .createdAt(r.getCreatedAt())
                .build();
    }
}