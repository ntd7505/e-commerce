package com.NguyenDat.ecommerce.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.service.EmailService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {

    JavaMailSender mailSender;

    @NonFinal
    @Value("${app.mail.from}")
    String from;

    @Override
    public void sendPasswordResetCode(String recipientEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(recipientEmail);
        message.setSubject("NexaMart - Mã đặt lại mật khẩu");
        message.setText(
                """
				Xin chào,

				Mã đặt lại mật khẩu NexaMart của bạn là: %s

				Mã có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.
				"""
                        .formatted(code));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            log.error("Unable to send password reset email to {}", recipientEmail, exception);
            throw new AppException(ErrorCode.EMAIL_DELIVERY_FAILED);
        }
    }
}
