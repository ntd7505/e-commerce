package com.NguyenDat.ecommerce.service;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.NguyenDat.ecommerce.common.constant.AdminPermission;
import com.NguyenDat.ecommerce.entity.Permission;
import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.repository.PermissionRepository;
import com.NguyenDat.ecommerce.repository.RoleRepository;
import com.NguyenDat.ecommerce.repository.UserRepository;

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

    @Transactional
    public void initialize() {
        Set<Permission> permissions = AdminPermission.ALL.stream()
                .map(this::findOrCreatePermission)
                .collect(Collectors.toSet());

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
        if (userRepository.findByEmail("admin@gmail.com").isPresent()) {
            return;
        }

        User user = User.builder()
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("admin"))
                .fullName("admin")
                .phoneNumber("123456789")
                .roles(Set.of(adminRole))
                .build();
        userRepository.save(user);
    }
}
