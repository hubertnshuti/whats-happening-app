package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.entity.EventSave;
import com.whatshappening.backend.entity.EventSaveId;
import com.whatshappening.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventSaveRepository extends JpaRepository<EventSave, EventSaveId> {
    boolean existsByUserAndEvent(User user, Event event);
    void deleteByUserAndEvent(User user, Event event);
    Page<EventSave> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}