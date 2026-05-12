package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.entity.EventReport;
import com.whatshappening.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EventReportRepository extends JpaRepository<EventReport, UUID> {
    boolean existsByEventAndReporter(Event event, User reporter);
    Page<EventReport> findByStatusOrderByCreatedAtAsc(EventReport.Status status, Pageable pageable);
}