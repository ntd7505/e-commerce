package com.nguyendat.ecommerce.common.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void requestWithoutToken_ShouldReturn401() throws Exception {
        // Accessing a protected endpoint without token should result in 401 Unauthorized
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginRequest_ShouldNotCreateSessionCookie() throws Exception {
        // Public endpoint should work without CSRF and shouldn't set session cookie JSESSIONID
        String loginPayload = "{\n" +
                "  \"email\": \"admin@gmail.com\",\n" +
                "  \"password\": \"admin\"\n" +
                "}";

        MvcResult result = mockMvc.perform(post("/auth/login")
                .contentType("application/json")
                .content(loginPayload))
                .andExpect(cookie().doesNotExist("JSESSIONID"))
                .andReturn();
        
        // Asserting it doesn't fail with 403 Forbidden (which would happen if CSRF was enabled and token missing)
        // It might be 200 OK or 400 Bad Request depending on test data, but not 403.
        assert result.getResponse().getStatus() != 403;
    }
}
