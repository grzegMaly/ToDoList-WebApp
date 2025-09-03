package com.todolist.backend.security.services;

import com.todolist.backend.model.User;
import com.todolist.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JpaUserDetailsPasswordService implements UserDetailsPasswordService {

    private final UserRepository userRepository;

    @Override
    public UserDetails updatePassword(UserDetails userDetails, String newPassword) {

        UUID userId = ((AuthUserDetails) userDetails).getUserId();
        User user = userRepository.findUserByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setPassword(newPassword);
        User savedUser = userRepository.save(user);
        return AuthUserDetails.build(savedUser);
    }
}
