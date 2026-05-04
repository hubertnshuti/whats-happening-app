package com.whatshappening.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id; // Using UUID as specified in the ERD

    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @Column(length = 255)
    private String description;
}