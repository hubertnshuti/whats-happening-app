package com.whatshappening.backend.service;

import com.whatshappening.backend.dto.event.EventQueryParams;
import com.whatshappening.backend.entity.Event;
import com.whatshappening.backend.entity.EventStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class EventSpecifications {

    public static Specification<Event> build(EventQueryParams p, boolean publicOnly) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (publicOnly) {
                predicates.add(root.get("status").in(EventStatus.PUBLISHED, EventStatus.ONGOING));
            } else if (p.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), p.getStatus()));
            }

            if (p.getQ() != null && !p.getQ().isBlank()) {
                String like = "%" + p.getQ().toLowerCase() + "%";
                Predicate inTitle = cb.like(cb.lower(root.get("title")), like);
                Predicate inDesc = cb.like(cb.lower(root.get("description")), like);
                predicates.add(cb.or(inTitle, inDesc));
            }

            if (p.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), p.getCategoryId()));
            }

            if (p.getCategorySlug() != null && !p.getCategorySlug().isBlank()) {
                predicates.add(cb.equal(root.get("category").get("slug"), p.getCategorySlug()));
            }

            if (p.getIsFree() != null) {
                predicates.add(cb.equal(root.get("isFree"), p.getIsFree()));
            }

            if (p.getStartFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startAt"), p.getStartFrom()));
            }

            if (p.getStartTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startAt"), p.getStartTo()));
            }

            if (p.getOrganizerId() != null) {
                predicates.add(cb.equal(root.get("organizer").get("id"), p.getOrganizerId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}