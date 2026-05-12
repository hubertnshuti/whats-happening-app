package com.whatshappening.backend.dto.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReactionRequest {
    @NotBlank @Size(max = 16)
    private String emoji;
}