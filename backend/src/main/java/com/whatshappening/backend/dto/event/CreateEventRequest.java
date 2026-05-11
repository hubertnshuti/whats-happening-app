package com.whatshappening.backend.dto.event;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter
public class CreateEventRequest {

    @NotBlank @Size(min = 3, max = 200)
    private String title;

    @NotBlank @Size(min = 10)
    private String description;

    @Size(max = 500)
    private String shortDescription;

    @NotNull
    private UUID categoryId;

    // Either locationId OR customLocationText must be provided
    private UUID locationId;

    @Size(max = 255)
    private String customLocationText;

    @NotNull @Future(message = "Start time must be in the future")
    private LocalDateTime startAt;

    @NotNull
    private LocalDateTime endAt;

    @Size(max = 500)
    private String coverImageUrl;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private Boolean isFree;

    @Size(max = 255)
    private String priceInfo;

    @Size(max = 500)
    private String externalUrl;
}
