package com.nguyendat.ecommerce.service;

import com.nguyendat.ecommerce.dto.request.auth.AuthenticationRequest;
import com.nguyendat.ecommerce.dto.request.auth.IntrospectRequest;
import com.nguyendat.ecommerce.dto.request.auth.LogoutRequest;
import com.nguyendat.ecommerce.dto.request.auth.RefreshTokenRequest;
import com.nguyendat.ecommerce.dto.response.AuthenticationResponse;
import com.nguyendat.ecommerce.dto.response.IntrospectResponse;

public interface AuthenticationService {
    IntrospectResponse introspect(IntrospectRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    void logOut(LogoutRequest logoutRequest);

    AuthenticationResponse refreshToken(RefreshTokenRequest request);
}

