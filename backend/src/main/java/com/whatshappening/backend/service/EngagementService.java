package com.whatshappening.backend.service;

import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.engagement.ReportRequest;
import com.whatshappening.backend.dto.engagement.ToggleResponse;
import com.whatshappening.backend.dto.event.EventSummary;
import com.whatshappening.backend.entity.*;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.exception.ResourceNotFoundException;
import com.whatshappening.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EngagementService {

    private final EventRepository eventRepository;
    private final EventSaveRepository saveRepository;
    private final EventLikeRepository likeRepository;
    private final EventReportRepository reportRepository;
    private final EventService eventService;

    @Transactional
    public ToggleResponse toggleSave(UUID eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (saveRepository.existsByUserAndEvent(user, event)) {
            saveRepository.deleteByUserAndEvent(user, event);
            return ToggleResponse.builder().active(false).build();
        }

        EventSaveId id = new EventSaveId(user.getId(), event.getId());
        EventSave save = EventSave.builder().id(id).user(user).event(event).build();
        saveRepository.save(save);
        return ToggleResponse.builder().active(true).build();
    }

    @Transactional
    public ToggleResponse toggleLike(UUID eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        boolean nowActive;
        if (likeRepository.existsByUserAndEvent(user, event)) {
            likeRepository.deleteByUserAndEvent(user, event);
            nowActive = false;
        } else {
            EventSaveId id = new EventSaveId(user.getId(), event.getId());
            EventLike like = EventLike.builder().id(id).user(user).event(event).build();
            likeRepository.save(like);
            nowActive = true;
        }
        long total = likeRepository.countByEvent(event);
        return ToggleResponse.builder().active(nowActive).totalCount(total).build();
    }

    @Transactional
    public void reportEvent(UUID eventId, ReportRequest req, User reporter) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (reportRepository.existsByEventAndReporter(event, reporter)) {
            throw new ApiException("You have already reported this event", HttpStatus.CONFLICT);
        }

        EventReport report = EventReport.builder()
                .event(event)
                .reporter(reporter)
                .reason(req.getReason())
                .details(req.getDetails())
                .build();
        reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public PageResponse<EventSummary> getSavedEvents(User user, int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(0, page),
                Math.min(Math.max(1, size), 50),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return PageResponse.from(
                saveRepository.findByUserOrderByCreatedAtDesc(user, pageable),
                save -> eventService.toSummary(save.getEvent())
        );
    }
}