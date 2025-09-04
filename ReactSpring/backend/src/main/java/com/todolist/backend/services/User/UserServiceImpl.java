package com.todolist.backend.services.User;

import com.todolist.backend.model.User;
import com.todolist.backend.repositories.UserRepository;
import com.todolist.backend.security.jwt.JwtPrincipal;
import com.todolist.backend.security.response.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @PreAuthorize("hasRole('USER')")
    public UserInfoResponse me(JwtPrincipal principal) {
        User user = userRepository.findUserByUserId(principal.userId())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        return new UserInfoResponse(
                user.getUserId(),
                user.getUsername(),
                Set.of(user.getRole().getRoleName().name())
        );
    }
}
