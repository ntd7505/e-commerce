package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.response.StaffCreationResponse;
import com.NguyenDat.ecommerce.mapper.UserMapper;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;

    UserMapper userMapper;

    public void handleSaveUser(StaffCreationResponse staffCreationResponse) {


//        this.userRepository.save(userMapper.toStaffCreationResponse())
    }

    public StaffCreationResponse getUserById(long id) {
        User user = userRepository.getUserById(id);
        return userMapper.toStaffCreationResponse(user);
    }

    public List<StaffCreationResponse> getAllUsers() {
        return userRepository.findAll().stream().map(userMapper::toStaffCreationResponse).toList();
    }

}
