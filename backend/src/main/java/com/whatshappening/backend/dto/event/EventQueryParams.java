package com.whatshappening.backend.dto.event;

import com.whatshappening.backend.entity.EventStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter
public class EventQueryParams {
    private String q;                  // keyword (matches title or description)
    private UUID categoryId;
    private String categorySlug;
    private EventStatus status;
    private Boolean isFree;
    private LocalDateTime startFrom;
    private LocalDateTime startTo;
    private UUID organizerId;
    private String sort = "startAt,asc"; // e.g. "startAt,desc" or "createdAt,desc"
    private int page = 0;
    private int size = 12;
}