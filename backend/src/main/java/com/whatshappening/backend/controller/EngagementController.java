package com.whatshappening.backend.controller;

import com.whatshappening.backend.dto.common.ApiResponse;
import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.engagement.ReportRequest;
import com.whatshappening.backend.dto.engagement.ToggleResponse;
import com.whatshappening.backend.dto.event.EventSummary;
import com.whatshappening.backend.entity.User;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.repository.UserRepository;
import com.whatshappening.backend.service.EngagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class EngagementController {

    private final EngagementService engagementService;
    private final UserRepository userRepository;

    @PostMapping("/events/{id}/save")
    public ResponseEntity<ApiResponse<ToggleResponse>> toggleSave(
            @PathVariable UUID id, Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Save toggled", engagementService.toggleSave(id, user)));
    }

    @PostMapping("/events/{id}/like")
    public ResponseEntity<ApiResponse<ToggleResponse>> toggleLike(
            @PathVariable UUID id, Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Like toggled", engagementService.toggleLike(id, user)));
    }

    @PostMapping("/events/{id}/report")
    public ResponseEntity<ApiResponse<Object>> reportEvent(
            @PathVariable UUID id,
            @Valid @RequestBody ReportRequest req,
            Authentication auth) {
        User user = requireUser(auth);
        engagementService.reportEvent(id, req, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report submitted"));
    }

    @GetMapping("/me/saved-events")
    public ResponseEntity<ApiResponse<PageResponse<EventSummary>>> mySaved(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Saved events", engagementService.getSavedEvents(user, page, size)));
    }

    private User requireUser(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new ApiException("Not authenticated", HttpStatus.UNAUTHORIZED);
        }
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED));
    }
}