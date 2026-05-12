package com.whatshappening.backend.dto.event;

import com.whatshappening.backend.entity.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Getter @Builder
@NoArgsConstructor @AllArgsConstructor
public class LocationResponse {
    private UUID id;
    private String name;
    private String address;
    private String city;
    private String country;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public static LocationResponse from(Location l) {
        if (l == null) return null;
        return LocationResponse.builder()
                .id(l.getId())
                .name(l.getName())
                .address(l.getAddress())
                .city(l.getCity())
                .country(l.getCountry())
                .latitude(l.getLatitude())
                .longitude(l.getLongitude())
                .build();
    }
}
