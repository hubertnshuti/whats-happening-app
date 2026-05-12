package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.entity.EventLike;
import com.whatshappening.backend.entity.EventSaveId;
import com.whatshappening.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventLikeRepository extends JpaRepository<EventLike, EventSaveId> {
    boolean existsByUserAndEvent(User user, Event event);
    void deleteByUserAndEvent(User user, Event event);
    long countByEvent(Event event);
}