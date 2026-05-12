package com.whatshappening.backend.dto.forum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class QuestionRequest {
    @NotBlank @Size(min = 3, max = 2000)
    private String question;
}