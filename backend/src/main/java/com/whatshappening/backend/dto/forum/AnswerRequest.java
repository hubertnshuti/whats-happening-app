package com.whatshappening.backend.dto.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AnswerRequest {
    @NotBlank @Size(min = 1, max = 5000)
    private String answer;
}