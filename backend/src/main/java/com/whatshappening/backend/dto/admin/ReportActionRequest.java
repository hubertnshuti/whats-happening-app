package com.whatshappening.backend.dto.admin;

import com.whatshappening.backend.entity.EventReport;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReportActionRequest {
    @NotNull
    private EventReport.Status status; // REVIEWED, DISMISSED, ACTIONED
}