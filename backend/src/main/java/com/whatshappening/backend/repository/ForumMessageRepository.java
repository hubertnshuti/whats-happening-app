package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.EventForum;
import com.whatshappening.backend.entity.ForumMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ForumMessageRepository extends JpaRepository<ForumMessage, UUID> {
    Page<ForumMessage> findByForumAndDeletedAtIsNullOrderByCreatedAtDesc(EventForum forum, Pageable pageable);
}