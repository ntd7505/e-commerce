package com.nguyendat.ecommerce.validator;

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
        if (password == null || password.length() < min) return false;
        boolean hasLower = false;
        boolean hasUpper = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        String specialChars = "!@#$%^&*";

        for (int i = 0; i < password.length(); i++) {
            char ch = password.charAt(i);
            if (ch >= 'a' && ch <= 'z') hasLower = true;
            else if (ch >= 'A' && ch <= 'Z') hasUpper = true;
            else if (ch >= '0' && ch <= '9') hasDigit = true;
            else if (specialChars.indexOf(ch) >= 0) hasSpecial = true;
            else return false; // Any other character is invalid per ASCII original policy

            if (hasLower && hasUpper && hasDigit && hasSpecial) return true;
        }

        return false;
    }
}

