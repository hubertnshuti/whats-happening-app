package com.whatshappening.backend.dto.admin;

import lombok.*;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class StatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalEvents;
    private long publishedEvents;
    private long upcomingEvents;
    private long pendingReports;
}