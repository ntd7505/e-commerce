package com.NguyenDat.ecommerce.controller;

import com.NguyenDat.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    UserService userService;
//
//    @PostMapping("/user")
//    public ResponseAPI<StaffCreationRequest> createStaff(@RequestBody StaffCreationRequest staff) {
//        System.out.println("User received: " + staff);
//        System.out.println("Roles: " + staff.getRoles());
//        return ResponseAPI.<StaffCreationRequest>builder()
//                .code(HttpStatus.CREATED.value())
//                .message("Added successfully")
//                .data(staff)
//                .build();
//    }

}
