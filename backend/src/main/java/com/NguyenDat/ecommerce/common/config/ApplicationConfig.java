package com.NguyenDat.ecommerce.common.config;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

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
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    @Profile("!test")
    ApplicationRunner applicationRunner(
            UserRepository userRepository, RoleRepository roleRepository, PermissionRepository permissionRepository) {
        return args -> {
            Set<Permission> permissions = AdminPermission.ALL.stream()
                    .map(name -> permissionRepository
                            .findById(name)
                            .orElseGet(() -> permissionRepository.save(Permission.builder()
                                    .name(name)
                                    .description("Allows " + name.toLowerCase().replace('_', ' '))
                                    .build())))
                    .collect(Collectors.toSet());

            Role adminRole = roleRepository.findById("ADMIN").orElseGet(() -> newRole("ADMIN", "System administrator"));
            if (adminRole.getPermissions().isEmpty()) {
                adminRole.setPermissions(permissions);
            }
            adminRole = roleRepository.save(adminRole);

            Role staffRole = roleRepository.findById("STAFF").orElseGet(() -> newRole("STAFF", "Store staff"));
            if (staffRole.getPermissions().isEmpty()) {
                staffRole.setPermissions(permissions.stream()
                        .filter(permission -> AdminPermission.STAFF.contains(permission.getName()))
                        .collect(Collectors.toSet()));
            }
            roleRepository.save(staffRole);

            roleRepository
                    .findById("CUSTOMER")
                    .orElseGet(() -> roleRepository.save(newRole("CUSTOMER", "Customer account")));

            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User user = User.builder()
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("admin"))
                        .fullName("admin")
                        .phoneNumber("123456789")
                        .roles(Set.of(adminRole))
                        .build();
                userRepository.save(user);
            }
        };
    }

    private Role newRole(String name, String description) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        return role;
    }
}
