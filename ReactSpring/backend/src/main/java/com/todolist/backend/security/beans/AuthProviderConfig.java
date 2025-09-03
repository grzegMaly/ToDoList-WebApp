package com.todolist.backend.security.beans;

import com.todolist.backend.security.services.JpaUserDetailsPasswordService;
import com.todolist.backend.security.services.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AuthProviderConfig {

    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final JpaUserDetailsPasswordService passwordService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsServiceImpl);
        provider.setPasswordEncoder(passwordEncoder);
        provider.setHideUserNotFoundExceptions(true);
        provider.setUserDetailsPasswordService(passwordService);
        return provider;
    }
}
