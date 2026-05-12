package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.ForumMessage;
import com.whatshappening.backend.entity.MessageReaction;
import com.whatshappening.backend.entity.MessageReactionId;
import com.whatshappening.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, MessageReactionId> {
    List<MessageReaction> findByMessage(ForumMessage message);
    boolean existsByMessageAndUserAndIdEmoji(ForumMessage message, User user, String emoji);
}