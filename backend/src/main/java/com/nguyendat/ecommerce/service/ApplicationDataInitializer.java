package com.nguyendat.ecommerce.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

import com.nguyendat.ecommerce.common.constant.AdminPermission;
import com.nguyendat.ecommerce.entity.Permission;
import com.nguyendat.ecommerce.entity.Role;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.repository.PermissionRepository;
import com.nguyendat.ecommerce.repository.RoleRepository;
import com.nguyendat.ecommerce.repository.UserRepository;

import org.springframework.core.env.Environment;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationDataInitializer {

    UserRepository userRepository;
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    PasswordEncoder passwordEncoder;
    Environment environment;

    @Transactional
    public void initialize() {
        Set<Permission> permissions =
                AdminPermission.ALL.stream().map(this::findOrCreatePermission).collect(Collectors.toSet());

        Role adminRole = findOrCreateRole("ADMIN", "System administrator");
        if (adminRole.getPermissions().isEmpty()) {
            adminRole.setPermissions(permissions);
        }

        Role staffRole = findOrCreateRole("STAFF", "Store staff");
        if (staffRole.getPermissions().isEmpty()) {
            staffRole.setPermissions(permissions.stream()
                    .filter(permission -> AdminPermission.STAFF.contains(permission.getName()))
                    .collect(Collectors.toSet()));
        }

        findOrCreateRole("CUSTOMER", "Customer account");
        createDefaultAdminIfMissing(adminRole);
    }

    private Permission findOrCreatePermission(String name) {
        return permissionRepository
                .findById(name)
                .orElseGet(() -> permissionRepository.save(Permission.builder()
                        .name(name)
                        .description("Allows " + name.toLowerCase().replace('_', ' '))
                        .build()));
    }

    private Role findOrCreateRole(String name, String description) {
        return roleRepository.findById(name).orElseGet(() -> {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            return roleRepository.save(role);
        });
    }

    private void createDefaultAdminIfMissing(Role adminRole) {
        boolean enabled = Boolean.parseBoolean(environment.getProperty("APP_BOOTSTRAP_ADMIN_ENABLED", "false"));
        boolean isDev = Arrays.asList(environment.getActiveProfiles()).contains("dev");
        if (!enabled || !isDev) {
            return;
        }

        String email = environment.getProperty("APP_BOOTSTRAP_ADMIN_EMAIL");
        String password = environment.getProperty("APP_BOOTSTRAP_ADMIN_PASSWORD");
        if (email == null || password == null) {
            return;
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return;
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName("Admin")
                .phoneNumber("123456789")
                .roles(Set.of(adminRole))
                .build();
        userRepository.save(user);
    }
}

