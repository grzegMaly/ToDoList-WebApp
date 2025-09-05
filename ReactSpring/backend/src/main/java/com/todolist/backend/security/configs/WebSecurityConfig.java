package com.todolist.backend.security.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebSecurityConfig {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                long maxAge = 3600L;

                registry.addMapping("/api/v1/**")
                        .allowedMethods("*")
                        .allowedOrigins(frontendUrl)
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(maxAge);
            }
        };
    }
}
