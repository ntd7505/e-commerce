package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.request.auth.ChangePasswordRequest;
import com.NguyenDat.ecommerce.dto.request.auth.ForgotPasswordRequest;
import com.NguyenDat.ecommerce.dto.request.auth.ResetPasswordRequest;

public interface PasswordManagementService {
    void changePassword(ChangePasswordRequest request);

    void requestPasswordReset(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
