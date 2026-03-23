package com.NguyenDat.ecommerce.modules.user.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<PasswordConstraint, String> {
    private int min;

    @Override
    public void initialize(PasswordConstraint annotation) {
        this.min = annotation.min();
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) return false;
        return password.length() >= min
                && password.matches(".*[A-Z].*") // có chữ hoa
                && password.matches(".*[0-9].*") // có số
                && password.matches(".*[!@#$%^&*].*"); // có ký tự đặc biệt
    }
}
