package com.whatshappening.backend.controller;

import com.whatshappening.backend.dto.common.ApiResponse;
import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.event.EventQueryParams;
import com.whatshappening.backend.dto.event.EventSummary;
import com.whatshappening.backend.service.EventQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventSearchController {

    private final EventQueryService eventQueryService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<EventSummary>>> list(
            @ModelAttribute EventQueryParams params) {
        return ResponseEntity.ok(ApiResponse.success(
                "Events retrieved",
                eventQueryService.searchPublic(params)));
    }
}