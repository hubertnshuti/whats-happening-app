package com.whatshappening.backend.service;

import com.whatshappening.backend.dto.common.PageResponse;
import com.whatshappening.backend.dto.event.EventQueryParams;
import com.whatshappening.backend.dto.event.EventSummary;
import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventQueryService {

    private final EventRepository eventRepository;
    private final EventService eventService;

    @Transactional(readOnly = true)
    public PageResponse<EventSummary> searchPublic(EventQueryParams params) {
        // If an organizer is looking at their own dashboard, don't restrict to PUBLISHED
        if (params.getOrganizerId() != null) {
            return search(params, false);
        }
        return search(params, true);
    }

    @Transactional(readOnly = true)
    public PageResponse<EventSummary> searchAll(EventQueryParams params) {
        return search(params, false);
    }

    private PageResponse<EventSummary> search(EventQueryParams params, boolean publicOnly) {
        Specification<Event> spec = EventSpecifications.build(params, publicOnly);
        Pageable pageable = buildPageable(params);
        return PageResponse.from(eventRepository.findAll(spec, pageable), eventService::toSummary);
    }

    private Pageable buildPageable(EventQueryParams params) {
        int page = Math.max(0, params.getPage());
        int size = Math.min(Math.max(1, params.getSize()), 50); // cap at 50 to prevent abuse

        Sort sort = parseSort(params.getSort());
        return PageRequest.of(page, size, sort);
    }

    private Sort parseSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "startAt");
        }
        String[] parts = sortParam.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = parts.length > 1 && parts[1].trim().equalsIgnoreCase("desc")
                ? Sort.Direction.DESC : Sort.Direction.ASC;

        // whitelist sortable fields — prevents SQL injection through sort param
        if (!field.matches("^(startAt|endAt|createdAt|viewCount|title)$")) {
            field = "startAt";
        }
        return Sort.by(direction, field);
    }
}