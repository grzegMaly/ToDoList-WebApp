package com.todolist.backend.controllers;

import com.todolist.backend.response.ApiResponse;
import com.todolist.backend.security.jwt.JwtPrincipal;
import com.todolist.backend.security.request.LoginRequest;
import com.todolist.backend.security.request.SignupRequest;
import com.todolist.backend.security.response.UserInfoResponse;
import com.todolist.backend.services.Auth.AuthService;
import com.todolist.backend.services.User.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/public/login")
    public ResponseEntity<ApiResponse<UserInfoResponse>> signIn(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.authenticate(loginRequest);
    }

    @PostMapping("/public/register")
    public ResponseEntity<ApiResponse<UserInfoResponse>> signUp(@Valid @RequestBody SignupRequest signupRequest) {
        return authService.register(signupRequest);
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getUserInfo(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(userService.me(principal));
    }
}
