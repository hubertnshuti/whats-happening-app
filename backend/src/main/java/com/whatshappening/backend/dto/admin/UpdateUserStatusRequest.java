package com.whatshappening.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateUserStatusRequest {
    @NotBlank
    @Pattern(regexp = "ACTIVE|SUSPENDED|DEACTIVATED")
    private String status;
}