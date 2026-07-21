package com.nguyendat.ecommerce.validator;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import jakarta.validation.ConstraintValidatorContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullSource;

class PasswordValidatorTest {

    private PasswordValidator validator;
    private ConstraintValidatorContext context;

    @BeforeEach
    void setUp() {
        validator = new PasswordValidator();
        PasswordConstraint constraint = mock(PasswordConstraint.class);
        when(constraint.min()).thenReturn(8);
        validator.initialize(constraint);
        context = mock(ConstraintValidatorContext.class);
    }

    @ParameterizedTest
    @CsvSource({
        "Valid@123, true", // valid: upper, lower, digit, special, length >= 8
        "valid@123, false", // missing upper
        "VALID@123, false", // missing lower
        "Valid@Abc, false", // missing digit
        "Valid1234, false", // missing special
        "Val@12, false", // short length (7 < 8)
        "Válid@123, false", // contains non-ASCII 'á'
        "Valid@ 123, false", // contains space
        "Valid~123, false" // contains invalid special '~'
    })
    void isValid_shouldValidatePasswordPolicy(String password, boolean expected) {
        assertEquals(expected, validator.isValid(password, context));
    }

    @ParameterizedTest
    @NullSource
    void isValid_shouldReturnFalse_whenPasswordIsNull(String password) {
        assertEquals(false, validator.isValid(password, context));
    }
}
