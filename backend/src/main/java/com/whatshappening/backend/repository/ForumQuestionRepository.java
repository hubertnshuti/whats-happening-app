package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.EventForum;
import com.whatshappening.backend.entity.ForumQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ForumQuestionRepository extends JpaRepository<ForumQuestion, UUID> {
    Page<ForumQuestion> findByForumOrderByCreatedAtDesc(EventForum forum, Pageable pageable);
}