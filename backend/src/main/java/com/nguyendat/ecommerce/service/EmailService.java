package com.nguyendat.ecommerce.service;

public interface EmailService {
    void sendPasswordResetCode(String recipientEmail, String code);
}

