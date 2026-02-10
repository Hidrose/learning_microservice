package com.backend.cart_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.RequestInterceptor;

@Configuration
public class InternalFeignConfig {

    @Bean
    public RequestInterceptor internalHeader() {
        return template -> template.header("X-Internal-Call", "true");
    }
}
