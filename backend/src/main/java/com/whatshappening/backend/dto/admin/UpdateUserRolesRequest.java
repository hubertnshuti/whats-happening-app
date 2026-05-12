package com.whatshappening.backend.dto.admin;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter @Setter
public class UpdateUserRolesRequest {
    @NotEmpty
    private Set<String> roles;
}