package com.whatshappening.backend.dto.event;

import com.whatshappening.backend.dto.auth.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Builder
@NoArgsConstructor @AllArgsConstructor
public class EventResponse {
    private UUID id;
    private String title;
    private String slug;
    private String description;
    private String shortDescription;
    private CategoryResponse category;
    private LocationResponse location;
    private String customLocationText;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String coverImageUrl;
    private String status;
    private Integer capacity;
    private boolean isFree;
    private String priceInfo;
    private String externalUrl;
    private long viewCount;
    private UserResponse organizer;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
