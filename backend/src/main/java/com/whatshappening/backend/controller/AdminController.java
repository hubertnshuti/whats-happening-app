package com.whatshappening.backend.controller;

import com.whatshappening.backend.dto.admin.*;
import com.whatshappening.backend.dto.auth.UserResponse;
import com.whatshappening.backend.dto.common.ApiResponse;
import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.entity.User;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.repository.UserRepository;
import com.whatshappening.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> stats() {
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved", adminService.stats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> users(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", adminService.listUsers(page, size)));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success("User status updated", adminService.updateUserStatus(id, req)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/users/{id}/roles")
    public ResponseEntity<ApiResponse<UserResponse>> updateRoles(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRolesRequest req) {
        return ResponseEntity.ok(ApiResponse.success("User roles updated", adminService.updateUserRoles(id, req)));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<PageResponse<ReportResponse>>> pendingReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Pending reports retrieved", adminService.listPendingReports(page, size)));
    }

    @PostMapping("/reports/{id}/action")
    public ResponseEntity<ApiResponse<ReportResponse>> actionReport(
            @PathVariable UUID id,
            @Valid @RequestBody ReportActionRequest req,
            Authentication auth) {
        User moderator = requireUser(auth);
        return ResponseEntity.ok(ApiResponse.success("Report actioned", adminService.actionReport(id, req, moderator)));
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