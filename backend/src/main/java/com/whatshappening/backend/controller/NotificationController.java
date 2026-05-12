package com.whatshappening.backend.controller;

import com.whatshappening.backend.dto.common.ApiResponse;
import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.notification.NotificationResponse;
import com.whatshappening.backend.entity.User;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.repository.UserRepository;
import com.whatshappening.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notificationService.list(user, page, size)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unreadCount(Authentication auth) {
        User user = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Unread count",
                Map.of("count", notificationService.unreadCount(user))));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Object>> markRead(@PathVariable UUID id, Authentication auth) {
        User user = requireUser(auth);
        notificationService.markRead(id, user);
        return ResponseEntity.ok(ApiResponse.success("Marked as read"));
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResponse<Object>> markAllRead(Authentication auth) {
        User user = requireUser(auth);
        notificationService.markAllRead(user);
        return ResponseEntity.ok(ApiResponse.success("All marked as read"));
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