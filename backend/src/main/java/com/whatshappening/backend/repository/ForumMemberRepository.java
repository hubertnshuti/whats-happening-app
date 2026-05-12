package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.EventForum;
import com.whatshappening.backend.entity.ForumMember;
import com.whatshappening.backend.entity.ForumMemberId;
import com.whatshappening.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForumMemberRepository extends JpaRepository<ForumMember, ForumMemberId> {
    boolean existsByForumAndUser(EventForum forum, User user);
    void deleteByForumAndUser(EventForum forum, User user);
    long countByForum(EventForum forum);
}