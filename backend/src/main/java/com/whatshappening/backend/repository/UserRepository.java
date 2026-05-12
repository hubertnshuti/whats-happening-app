package com.whatshappening.backend.repository;

import com.whatshappening.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByAccountStatus(String accountStatus);
    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);
}