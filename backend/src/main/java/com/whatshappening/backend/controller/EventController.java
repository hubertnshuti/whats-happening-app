package com.whatshappening.backend.controller;

import com.whatshappening.backend.dto.common.ApiResponse;
import com.whatshappening.backend.dto.event.CreateEventRequest;
import com.whatshappening.backend.dto.event.EventResponse;
import com.whatshappening.backend.dto.event.EventSummary;
import com.whatshappening.backend.dto.event.UpdateEventRequest;
import com.whatshappening.backend.entity.User;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.repository.UserRepository;
import com.whatshappening.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> create(
            @Valid @RequestBody CreateEventRequest req,
            Authentication auth) {
        User user = requireUser(auth);
        EventResponse created = eventService.createEvent(req, user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created", created));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Event retrieved", eventService.getEventById(id)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<EventResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success("Event retrieved",
                eventService.getEventBySlugAndIncrementView(slug)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEventRequest req,
            Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Event updated", eventService.updateEvent(id, req, user)));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<EventResponse>> publish(@PathVariable UUID id, Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Event published", eventService.publishEvent(id, user)));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<EventResponse>> cancel(@PathVariable UUID id, Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Event cancelled", eventService.cancelEvent(id, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable UUID id, Authentication auth) {
        User user = requireUser(auth);
        eventService.deleteEvent(id, user);
        return ResponseEntity.ok(ApiResponse.success("Event deleted"));
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
