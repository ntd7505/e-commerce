package com.NguyenDat.ecommerce.controller.admin;

import com.NguyenDat.ecommerce.dto.response.ResponseAPI;
import com.NguyenDat.ecommerce.dto.response.StaffCreationResponse;
import com.NguyenDat.ecommerce.enums.SuccessCode;
import com.NguyenDat.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AdminUserController {
    @Autowired
    UserService userService;
//
//    @PostMapping("/admin/create")
//    public ResponseAPI<StaffCreationRequest> createStaff(@RequestBody @Valid StaffCreationRequest staff) {

    /// /        System.out.println("User received: " + staff);
    /// /        System.out.println("Roles: " + staff.getRoles());
//        return ResponseAPI.success(SuccessCode.USER_CREATED, this.userService.handleSaveUser(staff));
//    }
    @GetMapping("/user/{userId}")
    public ResponseAPI<StaffCreationResponse> getUser(@PathVariable int userId) {
        return ResponseAPI.success(SuccessCode.USER_FETCHED, userService.getUserById(userId));
    }

    @GetMapping("/user/list")
    public ResponseAPI<List<StaffCreationResponse>> getAllUser() {
        return ResponseAPI.<List<StaffCreationResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Success")
                .data(this.userService.getAllUsers())
                .build();
    }
}
