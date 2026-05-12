package com.whatshappening.backend.dto.forum;

import com.whatshappening.backend.entity.ForumMessage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateMessageRequest {
    @NotBlank @Size(min = 1, max = 5000)
    private String content;
    private ForumMessage.Type messageType;
    private Boolean pinned;
}