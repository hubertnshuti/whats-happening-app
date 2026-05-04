package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email); // Crucial for login validation[cite: 4]
    boolean existsByEmail(String email);      // Crucial for registration checks[cite: 4]
}