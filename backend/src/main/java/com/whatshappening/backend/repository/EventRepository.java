package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.entity.EventStatus;
import com.whatshappening.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;

import java.util.Optional;
import java.util.UUID;

public interface EventRepository
        extends JpaRepository<Event, UUID>, JpaSpecificationExecutor<Event> {

    Optional<Event> findBySlug(String slug);

    Page<Event> findByStatus(EventStatus status, Pageable pageable);

    Page<Event> findByOrganizer(User organizer, Pageable pageable);

    boolean existsBySlug(String slug);

    long countByStatus(EventStatus status);
    long countByStatusAndStartAtAfter(EventStatus status, LocalDateTime from);
    Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);

}