package com.whatshappening.backend.dto.engagement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @Builder
@NoArgsConstructor @AllArgsConstructor
public class ToggleResponse {
    private boolean active;     // true if now-saved/liked, false if now-removed
    private long totalCount;    // total likes on event (for like; 0 for save since private)
}