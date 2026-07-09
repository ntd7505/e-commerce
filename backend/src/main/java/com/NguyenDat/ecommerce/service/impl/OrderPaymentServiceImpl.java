package com.NguyenDat.ecommerce.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.Payment;
import com.NguyenDat.ecommerce.enums.PaymentMethod;
import com.NguyenDat.ecommerce.enums.PaymentStatus;
import com.NguyenDat.ecommerce.service.OrderPaymentService;

import org.springframework.beans.factory.annotation.Value;

@Service
public class OrderPaymentServiceImpl implements OrderPaymentService {

    @Value("${payment.vietqr.bank-code}")
    private String bankCode;

    @Value("${payment.vietqr.bank-account}")
    private String bankAccount;

    @Value("${payment.vietqr.bank-account-name}")
    private String bankAccountName;

    @Value("${payment.vietqr.qr-template}")
    private String qrTemplate;

    @Override
    public Payment createCodPayment(Order order) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(PaymentMethod.COD);
        payment.setStatus(PaymentStatus.UNPAID);
        payment.setAmount(order.getTotalAmount());
        return payment;
    }

    @Override
    public Payment createBankTransferPayment(Order order) {
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod(PaymentMethod.BANK_TRANSFER);
        payment.setStatus(PaymentStatus.UNPAID);
        payment.setAmount(order.getTotalAmount());

        String transactionCode = "NXM" + order.getId() + System.currentTimeMillis() % 1000;
        payment.setTransactionCode(transactionCode);

        return payment;
    }

    @Override
    public void markPaid(Order order) {
        Payment payment = requirePayment(order);
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
    }

    @Override
    public void markCancelled(Order order) {
        requirePayment(order).setStatus(PaymentStatus.CANCELLED);
    }

    private Payment requirePayment(Order order) {
        if (order.getPayment() == null) {
            throw new AppException(ErrorCode.PAYMENT_NOT_FOUND);
        }
        return order.getPayment();
    }

    @Override
    public void enrichPaymentResponse(com.NguyenDat.ecommerce.dto.response.PaymentResponse response) {
        if (response.getMethod() == PaymentMethod.BANK_TRANSFER) {
            response.setBankCode(bankCode);
            response.setBankAccount(bankAccount);
            response.setBankAccountName(bankAccountName);
            response.setTransferContent(response.getTransactionCode());
            String qrUrl = String.format(
                    "https://img.vietqr.io/image/%s-%s-%s.png?amount=%s&addInfo=%s&accountName=%s",
                    bankCode,
                    bankAccount,
                    qrTemplate,
                    response.getAmount().toPlainString(),
                    response.getTransactionCode(),
                    java.net.URLEncoder.encode(bankAccountName, java.nio.charset.StandardCharsets.UTF_8)
            );
            response.setQrCodeUrl(qrUrl);
        }
    }
}
