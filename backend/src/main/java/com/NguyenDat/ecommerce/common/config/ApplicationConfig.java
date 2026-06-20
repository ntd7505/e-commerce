package com.NguyenDat.ecommerce.common.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.NguyenDat.ecommerce.service.ApplicationDataInitializer;

@Configuration
public class ApplicationConfig {

    @Bean
    @Profile("!test")
    ApplicationRunner applicationRunner(ApplicationDataInitializer initializer) {
        return args -> initializer.initialize();
    }
}
