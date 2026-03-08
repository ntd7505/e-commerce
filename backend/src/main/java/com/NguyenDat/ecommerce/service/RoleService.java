package com.NguyenDat.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.dto.response.RoleResponse;
import com.NguyenDat.ecommerce.mapper.RoleMapper;
import com.NguyenDat.ecommerce.repository.RoleRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {
    RoleRepository roleRepository;
    RoleMapper roleMapper;

    public List<RoleResponse> getAllRole() {
        return this.roleRepository.findAll().stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }
}
