package com.whatshappening.backend.config;

import com.whatshappening.backend.entity.Role;
import com.whatshappening.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    private static final List<RoleSeed> DEFAULT_ROLES = List.of(
            new RoleSeed("USER", "Standard user — can browse, save, like, join forums"),
            new RoleSeed("ORGANIZER", "Can create and manage events"),
            new RoleSeed("MODERATOR", "Reviews reports and moderates content"),
            new RoleSeed("ADMIN", "Full system management"),
            new RoleSeed("SUPER_ADMIN", "Top-level access — can manage admins")
    );

    @Override
    public void run(String... args) {
        for (RoleSeed seed : DEFAULT_ROLES) {
            roleRepository.findByName(seed.name()).orElseGet(() -> {
                Role role = Role.builder()
                        .name(seed.name())
                        .description(seed.description())
                        .build();
                Role saved = roleRepository.save(role);
                log.info("Seeded role: {}", seed.name());
                return saved;
            });
        }
    }

    private record RoleSeed(String name, String description) {}
}