package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.entity.EventForum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EventForumRepository extends JpaRepository<EventForum, UUID> {
    Optional<EventForum> findByEvent(Event event);
    Optional<EventForum> findByEventId(UUID eventId);
}