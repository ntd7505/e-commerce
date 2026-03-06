package com.NguyenDat.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.entity.Role;
import com.NguyenDat.ecommerce.repository.RoleRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;

    public List<Role> getAllRole() {
        return this.roleRepository.findAll();
    }
}
