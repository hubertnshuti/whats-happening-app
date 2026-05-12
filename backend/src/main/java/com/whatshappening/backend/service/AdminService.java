package com.whatshappening.backend.service;

import com.whatshappening.backend.dto.admin.*;
import com.whatshappening.backend.dto.auth.UserResponse;
import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.entity.*;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.exception.ResourceNotFoundException;
import com.whatshappening.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EventRepository eventRepository;
    private final EventReportRepository reportRepository;

    @Transactional(readOnly = true)
    public StatsResponse stats() {
        return StatsResponse.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByAccountStatus("ACTIVE"))
                .totalEvents(eventRepository.count())
                .publishedEvents(eventRepository.countByStatus(EventStatus.PUBLISHED))
                .upcomingEvents(eventRepository.countByStatusAndStartAtAfter(EventStatus.PUBLISHED, LocalDateTime.now()))
                .pendingReports(reportRepository.countByStatus(EventReport.Status.PENDING))
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listUsers(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50));
        return PageResponse.from(
                userRepository.findAllByOrderByCreatedAtDesc(pageable),
                this::toUserResponse
        );
    }

    @Transactional
    public UserResponse updateUserStatus(UUID userId, UpdateUserStatusRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setAccountStatus(req.getStatus());
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateUserRoles(UUID userId, UpdateUserRolesRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<Role> newRoles = new HashSet<>();
        for (String name : req.getRoles()) {
            Role role = roleRepository.findByName(name)
                    .orElseThrow(() -> new ApiException("Unknown role: " + name, HttpStatus.BAD_REQUEST));
            newRoles.add(role);
        }
        user.setRoles(newRoles);
        return toUserResponse(user);
    }

    @Transactional(readOnly = true)
    public PageResponse<ReportResponse> listPendingReports(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(Math.max(1, size), 50));
        return PageResponse.from(
                reportRepository.findByStatusOrderByCreatedAtAsc(EventReport.Status.PENDING, pageable),
                ReportResponse::from
        );
    }

    @Transactional
    public ReportResponse actionReport(UUID reportId, ReportActionRequest req, User moderator) {
        EventReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setStatus(req.getStatus());
        report.setReviewedBy(moderator);
        report.setReviewedAt(LocalDateTime.now());
        return ReportResponse.from(report);
    }

    private UserResponse toUserResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .accountStatus(u.getAccountStatus())
                .emailVerified(u.isEmailVerified())
                .roles(u.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .createdAt(u.getCreatedAt())
                .build();
    }
}