package com.todolist.backend.security.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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

                registry.addMapping("/api/v1/auth/public/register")
                        .allowedMethods(HttpMethod.POST.name(), HttpMethod.OPTIONS.name())
                        .allowedOrigins(frontendUrl)
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(maxAge);

                registry.addMapping("/api/v1/auth/public/register")
                        .allowedMethods(HttpMethod.POST.name(), HttpMethod.OPTIONS.name())
                        .allowedHeaders("*")
                        .allowedOrigins(frontendUrl)
                        .allowCredentials(true)
                        .maxAge(maxAge);

                registry.addMapping("/api/v1/auth/me")
                        .allowedMethods(HttpMethod.GET.name(), HttpMethod.OPTIONS.name())
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .allowedOrigins(frontendUrl)
                        .maxAge(maxAge);

                registry.addMapping("/api/v1/csrf")
                        .allowedMethods(HttpMethod.GET.name(), HttpMethod.OPTIONS.name())
                        .allowedOrigins(frontendUrl)
                        .allowCredentials(true)
                        .allowedHeaders("*");

                registry.addMapping("/api/v1/lists")
                        .allowedMethods(
                                HttpMethod.GET.name(),
                                HttpMethod.POST.name(),
                                HttpMethod.PATCH.name(),
                                HttpMethod.DELETE.name(),
                                HttpMethod.OPTIONS.name()
                        )
                        .allowedOrigins(frontendUrl)
                        .allowCredentials(true)
                        .maxAge(maxAge);
            }
        };
    }
}
