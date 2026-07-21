package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.dto.request.auth.ChangePasswordRequest;
import com.nguyendat.ecommerce.dto.request.auth.ForgotPasswordRequest;
import com.nguyendat.ecommerce.dto.request.auth.ResetPasswordRequest;

public interface PasswordManagementService {
    void changePassword(ChangePasswordRequest request);

    void requestPasswordReset(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}

