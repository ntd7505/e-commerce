package com.nguyendat.ecommerce.service.impl;

import java.text.ParseException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Objects;
import java.util.StringJoiner;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.dto.request.auth.AuthenticationRequest;
import com.nguyendat.ecommerce.dto.request.auth.IntrospectRequest;
import com.nguyendat.ecommerce.dto.request.auth.LogoutRequest;
import com.nguyendat.ecommerce.dto.request.auth.RefreshTokenRequest;
import com.nguyendat.ecommerce.dto.response.AuthenticationResponse;
import com.nguyendat.ecommerce.dto.response.IntrospectResponse;
import com.nguyendat.ecommerce.entity.InvalidatedToken;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.Active;
import com.nguyendat.ecommerce.repository.InvalidatedTokenRepository;
import com.nguyendat.ecommerce.repository.UserRepository;
import com.nguyendat.ecommerce.service.AuthenticationService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    
    private static final String TOKEN_VERSION_CLAIM = "tokenVersion";
    private static final String REFRESH_TOKEN_TYPE = "REFRESH";

    public IntrospectResponse introspect(IntrospectRequest request) {
        try {
            var token = request.getToken();

            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            boolean verified = signedJWT.verify(verifier);
            boolean verifyResult = verified && expirationTime.after(new Date());

            if (!verifyResult) {
                throw new AppException(ErrorCode.TOKEN_INVALID);
            }

            String tokenId = signedJWT.getJWTClaimsSet().getJWTID();
            if (invalidatedTokenRepository.existsById(tokenId)) {
                throw new AppException(ErrorCode.TOKEN_BLACKLISTED);
            }

            String email = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository
                    .findByEmailAndDeletedFalse(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            Long tokenVersion = signedJWT.getJWTClaimsSet().getLongClaim(TOKEN_VERSION_CLAIM);
            if (user.getStatus() != Active.ACTIVE || !Objects.equals(user.getTokenVersion(), tokenVersion)) {
                throw new AppException(ErrorCode.TOKEN_BLACKLISTED);
            }

            return IntrospectResponse.builder().valid(true).build();
        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (user.getStatus() == Active.INACTIVE) {
            throw new AppException(ErrorCode.USER_INACTIVE);
        }
        if (user.isDeleted()) {
            throw new AppException(ErrorCode.USER_DELETED);
        }
        boolean matched = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!matched) throw new AppException(ErrorCode.UNAUTHENTICATED);
        var accessToken = generateToken(user, 1, ChronoUnit.HOURS, "ACCESS");
        var refreshToken = generateToken(user, 7, ChronoUnit.DAYS, REFRESH_TOKEN_TYPE);
        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    private String generateToken(User user, long amount, ChronoUnit unit, String tokenType) {
        // jwt : header + payload + signature
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("NguyenDat.ecom")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(amount, unit).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("type", tokenType)
                .claim(TOKEN_VERSION_CLAIM, user.getTokenVersion())
                .build();
        // payload
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        // sign
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token for user {}", user.getEmail(), e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions()))
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });
        }
        return stringJoiner.toString();
    }

    @Transactional
    public void logOut(@Valid LogoutRequest logoutRequest) {
        try {
            var token = logoutRequest.getToken();

            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            boolean verified = signedJWT.verify(verifier);
            boolean verifyResult = verified && expirationTime.after(new Date());

            if (!verifyResult) {
                throw new AppException(ErrorCode.TOKEN_INVALID);
            }

            String tokenId = signedJWT.getJWTClaimsSet().getJWTID();

            invalidatedTokenRepository.save(InvalidatedToken.builder()
                    .id(tokenId)
                    .expiryTime(expirationTime
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime())
                    .build());

        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }
    }

    @Transactional
    public AuthenticationResponse refreshToken(RefreshTokenRequest request) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(request.getRefreshToken());

            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            boolean verified = signedJWT.verify(verifier);
            boolean notExpired = expirationTime.after(new Date());

            if (!verified || !notExpired) {
                throw new AppException(ErrorCode.TOKEN_INVALID);
            }
            String tokenType = signedJWT.getJWTClaimsSet().getStringClaim("type");
            if (!REFRESH_TOKEN_TYPE.equals(tokenType)) {
                throw new AppException(ErrorCode.TOKEN_INVALID);
            }
            String tokenId = signedJWT.getJWTClaimsSet().getJWTID();
            if (invalidatedTokenRepository.existsById(tokenId)) {
                throw new AppException(ErrorCode.TOKEN_BLACKLISTED);
            }

            String email = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository
                    .findByEmailAndDeletedFalse(email)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            Long tokenVersion = signedJWT.getJWTClaimsSet().getLongClaim(TOKEN_VERSION_CLAIM);
            if (!Objects.equals(user.getTokenVersion(), tokenVersion)) {
                throw new AppException(ErrorCode.TOKEN_BLACKLISTED);
            }

            if (user.getStatus() == Active.INACTIVE) {
                throw new AppException(ErrorCode.USER_INACTIVE);
            }

            invalidatedTokenRepository.save(InvalidatedToken.builder()
                    .id(tokenId)
                    .expiryTime(expirationTime
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime())
                    .build());
            return AuthenticationResponse.builder()
                    .accessToken(generateToken(user, 1, ChronoUnit.HOURS, "ACCESS"))
                    .refreshToken(generateToken(user, 7, ChronoUnit.DAYS, REFRESH_TOKEN_TYPE))
                    .authenticated(true)
                    .build();

        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }
    }
}

