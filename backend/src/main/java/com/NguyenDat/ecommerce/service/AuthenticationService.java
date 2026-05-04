package com.NguyenDat.ecommerce.service;

import com.NguyenDat.ecommerce.dto.request.AuthenticationRequest;
import com.NguyenDat.ecommerce.dto.request.IntrospectRequest;
import com.NguyenDat.ecommerce.dto.request.LogoutRequest;
import com.NguyenDat.ecommerce.dto.request.RefreshTokenRequest;
import com.NguyenDat.ecommerce.dto.response.AuthenticationResponse;
import com.NguyenDat.ecommerce.dto.response.IntrospectResponse;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    void logOut(LogoutRequest logoutRequest);

    AuthenticationResponse refreshToken(RefreshTokenRequest request);
}
