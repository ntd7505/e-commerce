package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.nguyendat.ecommerce.entity.Role;
import com.nguyendat.ecommerce.repository.PermissionRepository;
import com.nguyendat.ecommerce.repository.RoleRepository;
import com.nguyendat.ecommerce.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ApplicationDataInitializerTest {

    @Mock
    UserRepository userRepository;

    @Mock
    RoleRepository roleRepository;

    @Mock
    PermissionRepository permissionRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    Environment environment;

    @InjectMocks
    ApplicationDataInitializer initializer;

    @Test
    void initialize_shouldReadExistingRolePermissionsInsideInitializationTransaction() {
        Role admin = Role.builder().name("ADMIN").build();
        Role staff = Role.builder().name("STAFF").build();
        Role customer = Role.builder().name("CUSTOMER").build();
        when(roleRepository.findById("ADMIN")).thenReturn(Optional.of(admin));
        when(roleRepository.findById("STAFF")).thenReturn(Optional.of(staff));
        when(roleRepository.findById("CUSTOMER")).thenReturn(Optional.of(customer));
        when(permissionRepository.findById(any())).thenReturn(Optional.empty());
        when(permissionRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        when(environment.getProperty("APP_BOOTSTRAP_ADMIN_ENABLED", "false")).thenReturn("false");
        when(environment.getActiveProfiles()).thenReturn(new String[]{});

        initializer.initialize();

        assertEquals(5, admin.getPermissions().size());
        assertEquals(4, staff.getPermissions().size());
        verify(roleRepository, never()).save(admin);
        verify(roleRepository, never()).save(staff);
        verify(roleRepository, never()).save(customer);
    }
}

