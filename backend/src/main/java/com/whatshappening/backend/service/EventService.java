package com.whatshappening.backend.service;

import com.whatshappening.backend.dto.auth.UserResponse;
import com.whatshappening.backend.dto.event.*;
import com.whatshappening.backend.entity.*;
import com.whatshappening.backend.exception.ApiException;
import com.whatshappening.backend.exception.ResourceNotFoundException;
import com.whatshappening.backend.repository.CategoryRepository;
import com.whatshappening.backend.repository.EventForumRepository;
import com.whatshappening.backend.repository.EventRepository;
import com.whatshappening.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final EventForumRepository eventForumRepository;
    private final SlugService slugService;
    private final ForumService forumService;


    @Transactional(readOnly = true)
    public Page<EventSummary> listEvents(UUID organizerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Event> eventPage;

        if (organizerId != null) {
            // If the frontend sends an organizerId, return ALL their events (including Drafts)
            eventPage = eventRepository.findByOrganizerId(organizerId, pageable);
        } else {
            // If it's the public search, ONLY show PUBLISHED events
            eventPage = eventRepository.findByStatus(EventStatus.PUBLISHED, pageable);
        }

        return eventPage.map(this::toSummary);
    }

    @Transactional
    public EventResponse createEvent(CreateEventRequest req, User organizer) {
        validateDates(req.getStartAt(), req.getEndAt());
        validateLocation(req.getLocationId(), req.getCustomLocationText());

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Location location = null;
        if (req.getLocationId() != null) {
            location = locationRepository.findById(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        }

        Event event = Event.builder()
                .title(req.getTitle().trim())
                .slug(slugService.generateUniqueEventSlug(req.getTitle()))
                .description(req.getDescription())
                .shortDescription(req.getShortDescription())
                .category(category)
                .location(location)
                .customLocationText(req.getCustomLocationText())
                .startAt(req.getStartAt())
                .endAt(req.getEndAt())
                .coverImageUrl(req.getCoverImageUrl())
                .status(EventStatus.PUBLISHED)
                .capacity(req.getCapacity())
                .isFree(req.getIsFree() == null || req.getIsFree())
                .priceInfo(req.getPriceInfo())
                .externalUrl(req.getExternalUrl())
                .organizer(organizer)
                .build();

        Event saved = eventRepository.save(event);
        forumService.ensureForumForEvent(saved);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return toResponse(event);
    }

    @Transactional
    public EventResponse getEventBySlugAndIncrementView(String slug) {
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        event.setViewCount(event.getViewCount() + 1);
        return toResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(UUID id, UpdateEventRequest req, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        ensureCanModify(event, currentUser);

        if (req.getTitle() != null) event.setTitle(req.getTitle().trim());
        if (req.getDescription() != null) event.setDescription(req.getDescription());
        if (req.getShortDescription() != null) event.setShortDescription(req.getShortDescription());
        if (req.getCoverImageUrl() != null) event.setCoverImageUrl(req.getCoverImageUrl());
        if (req.getCapacity() != null) event.setCapacity(req.getCapacity());
        // Lombok generates setFree(boolean) for primitive boolean field named isFree
        if (req.getIsFree() != null) event.setFree(req.getIsFree());
        if (req.getPriceInfo() != null) event.setPriceInfo(req.getPriceInfo());
        if (req.getExternalUrl() != null) event.setExternalUrl(req.getExternalUrl());
        if (req.getCustomLocationText() != null) event.setCustomLocationText(req.getCustomLocationText());

        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            event.setCategory(category);
        }

        if (req.getLocationId() != null) {
            Location location = locationRepository.findById(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
            event.setLocation(location);
        }

        if (req.getStartAt() != null || req.getEndAt() != null) {
            LocalDateTime start = req.getStartAt() != null ? req.getStartAt() : event.getStartAt();
            LocalDateTime end = req.getEndAt() != null ? req.getEndAt() : event.getEndAt();
            validateDates(start, end);
            event.setStartAt(start);
            event.setEndAt(end);
        }

        return toResponse(event);
    }

    @Transactional
    public EventResponse publishEvent(UUID id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        ensureCanModify(event, currentUser);

        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.COMPLETED) {
            throw new ApiException("Cannot publish a " + event.getStatus() + " event", HttpStatus.BAD_REQUEST);
        }
        event.setStatus(EventStatus.PUBLISHED);
        forumService.ensureForumForEvent(event);
        return toResponse(event);
    }

    @Transactional
    public EventResponse cancelEvent(UUID id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        ensureCanModify(event, currentUser);

        if (event.getStatus() == EventStatus.COMPLETED || event.getStatus() == EventStatus.CANCELLED) {
            throw new ApiException("Cannot cancel an event in status " + event.getStatus(), HttpStatus.BAD_REQUEST);
        }
        event.setStatus(EventStatus.CANCELLED);
        return toResponse(event);
    }

    @Transactional
    public void deleteEvent(UUID id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        ensureCanModify(event, currentUser);
        eventRepository.delete(event);
    }

    // ===== helpers =====

    private void validateDates(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new ApiException("Start and end times are required", HttpStatus.BAD_REQUEST);
        }
        if (!end.isAfter(start)) {
            throw new ApiException("End time must be after start time", HttpStatus.BAD_REQUEST);
        }
    }

    private void validateLocation(UUID locationId, String customLocationText) {
        boolean hasSaved = locationId != null;
        boolean hasCustom = customLocationText != null && !customLocationText.isBlank();
        if (!hasSaved && !hasCustom) {
            throw new ApiException("Either a saved location or custom location text must be provided", HttpStatus.BAD_REQUEST);
        }
    }

    private void ensureCanModify(Event event, User currentUser) {
        boolean isOrganizer = event.getOrganizer().getId().equals(currentUser.getId());
        boolean isPrivileged = currentUser.getRoles().stream()
                .map(Role::getName)
                .anyMatch(r -> r.equals("ADMIN") || r.equals("MODERATOR") || r.equals("SUPER_ADMIN"));
        if (!isOrganizer && !isPrivileged) {
            throw new ApiException("You don't have permission to modify this event", HttpStatus.FORBIDDEN);
        }
    }

    public EventResponse toResponse(Event e) {
        UUID forumId = eventForumRepository.findByEventId(e.getId())
                .map(f -> f.getId())
                .orElse(null);
        return EventResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .slug(e.getSlug())
                .description(e.getDescription())
                .shortDescription(e.getShortDescription())
                .category(CategoryResponse.from(e.getCategory()))
                .location(LocationResponse.from(e.getLocation()))
                .customLocationText(e.getCustomLocationText())
                .startAt(e.getStartAt())
                .endAt(e.getEndAt())
                .coverImageUrl(e.getCoverImageUrl())
                .status(e.getStatus().name())
                .capacity(e.getCapacity())
                .isFree(e.isFree())
                .priceInfo(e.getPriceInfo())
                .externalUrl(e.getExternalUrl())
                .viewCount(e.getViewCount())
                .organizer(toUserResponse(e.getOrganizer()))
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .forumId(forumId)
                .build();
    }

    public EventSummary toSummary(Event e) {
        String locationName = e.getLocation() != null ? e.getLocation().getName() : e.getCustomLocationText();
        return EventSummary.builder()
                .id(e.getId())
                .title(e.getTitle())
                .slug(e.getSlug())
                .shortDescription(e.getShortDescription())
                .coverImageUrl(e.getCoverImageUrl())
                .category(CategoryResponse.from(e.getCategory()))
                .locationName(locationName)
                .startAt(e.getStartAt())
                .endAt(e.getEndAt())
                .status(e.getStatus().name())
                .isFree(e.isFree())
                .viewCount(e.getViewCount())
                .build();
    }

    private UserResponse toUserResponse(User u) {
        Set<String> roles = u.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return UserResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .accountStatus(u.getAccountStatus())
                .emailVerified(u.isEmailVerified())
                .roles(roles)
                .createdAt(u.getCreatedAt())
                .build();
    }
}
