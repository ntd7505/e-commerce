package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.request.auth.AuthenticationRequest;
import com.NguyenDat.ecommerce.dto.request.auth.IntrospectRequest;
import com.NguyenDat.ecommerce.dto.request.auth.LogoutRequest;
import com.NguyenDat.ecommerce.dto.request.auth.RefreshTokenRequest;
import com.NguyenDat.ecommerce.dto.response.AuthenticationResponse;
import com.NguyenDat.ecommerce.dto.response.IntrospectResponse;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    void logOut(LogoutRequest logoutRequest);

    AuthenticationResponse refreshToken(RefreshTokenRequest request);
}
