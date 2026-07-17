package com.NguyenDat.ecommerce.common.config;

import java.util.Objects;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.Active;
import com.NguyenDat.ecommerce.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TokenVersionJwtValidator implements OAuth2TokenValidator<Jwt> {

    static final OAuth2Error INVALID_TOKEN = new OAuth2Error("invalid_token", "Token is no longer valid", null);

    UserRepository userRepository;

    @Override
    public OAuth2TokenValidatorResult validate(Jwt token) {
        User user = userRepository.findByEmailAndDeletedFalse(token.getSubject()).orElse(null);
        Long tokenVersion = token.getClaim("tokenVersion");

        if (user == null || user.getStatus() != Active.ACTIVE || !Objects.equals(user.getTokenVersion(), tokenVersion)) {
            return OAuth2TokenValidatorResult.failure(INVALID_TOKEN);
        }
        return OAuth2TokenValidatorResult.success();
    }
}
