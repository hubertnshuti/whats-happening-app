package com.whatshappening.backend.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Builder
@NoArgsConstructor @AllArgsConstructor
public class EventSummary {
    private UUID id;
    private String title;
    private String slug;
    private String shortDescription;
    private String coverImageUrl;
    private CategoryResponse category;
    private String locationName;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status;
    private boolean isFree;
    private long viewCount;
}
