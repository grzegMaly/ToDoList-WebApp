package com.todolist.backend.config;

import com.todolist.backend.model.AppRole;
import com.todolist.backend.model.Role;
import com.todolist.backend.model.User;
import com.todolist.backend.repositories.RoleRepository;
import com.todolist.backend.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class StartupData {

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> {
                        Role role = new Role(AppRole.ROLE_USER);
                        return roleRepository.save(role);
                    });

            if (!userRepository.existsUserByEmail("testUser@example.com")) {
                User user = new User();
                user.setUsername("testUser");
                user.setEmail("testUser@example.com");
                user.setPassword(passwordEncoder.encode("tempPassword"));
                user.setRole(userRole);
                userRepository.save(user);
            }
        };
    }
}