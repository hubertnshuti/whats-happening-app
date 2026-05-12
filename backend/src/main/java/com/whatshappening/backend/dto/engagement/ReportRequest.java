package com.whatshappening.backend.dto.engagement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReportRequest {
    @NotBlank @Size(max = 50)
    private String reason;

    @Size(max = 1000)
    private String details;
}