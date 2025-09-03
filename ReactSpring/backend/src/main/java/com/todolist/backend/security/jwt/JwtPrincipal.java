package com.todolist.backend.security.jwt;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;

public record JwtPrincipal(
        UUID userId,
        String email,
        Collection<? extends GrantedAuthority> roles
) implements UserDetails {

    public JwtPrincipal(UUID userId, String email, Set<String> roles) {
        this(userId, email,
                roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }
}
