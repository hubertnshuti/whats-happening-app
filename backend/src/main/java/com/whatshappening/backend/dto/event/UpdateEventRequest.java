package com.whatshappening.backend.dto.event;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter
public class UpdateEventRequest {
    @Size(min = 3, max = 200)
    private String title;

    @Size(min = 10)
    private String description;

    @Size(max = 500)
    private String shortDescription;

    private UUID categoryId;
    private UUID locationId;

    @Size(max = 255)
    private String customLocationText;

    private LocalDateTime startAt;
    private LocalDateTime endAt;

    @Size(max = 500)
    private String coverImageUrl;

    private Integer capacity;
    private Boolean isFree;

    @Size(max = 255)
    private String priceInfo;

    @Size(max = 500)
    private String externalUrl;
}
