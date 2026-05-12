package com.whatshappening.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "forum_members")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ForumMember {

    public enum Role { MEMBER, ADMIN }

    @EmbeddedId
    private ForumMemberId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("forumId")
    @JoinColumn(name = "forum_id")
    private EventForum forum;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "notifications_enabled", nullable = false)
    private boolean notificationsEnabled = true;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        if (joinedAt == null) joinedAt = LocalDateTime.now();
        if (role == null) role = Role.MEMBER;
    }
}