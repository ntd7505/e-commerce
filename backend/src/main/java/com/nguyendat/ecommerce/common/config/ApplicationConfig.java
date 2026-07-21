package com.nguyendat.ecommerce.common.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.nguyendat.ecommerce.service.ApplicationDataInitializer;

@Configuration
public class ApplicationConfig {

    @Bean
    @Profile("!test")
    ApplicationRunner applicationRunner(ApplicationDataInitializer initializer) {
        return args -> initializer.initialize();
    }

    @Bean
    public java.time.Clock clock() {
        return java.time.Clock.system(java.time.ZoneId.of("Asia/Ho_Chi_Minh"));
    }
}

