package com.todolist.backend.controllers;

import com.todolist.backend.response.ApiResponse;
import com.todolist.backend.security.request.LoginRequest;
import com.todolist.backend.security.request.SignupRequest;
import com.todolist.backend.security.response.LoginResponse;
import com.todolist.backend.security.response.UserInfoResponse;
import com.todolist.backend.services.Auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/public/login")
    public ResponseEntity<ApiResponse<LoginResponse>> signIn(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.authenticate(loginRequest);
    }

    @PostMapping("/public/register")
    public ResponseEntity<ApiResponse<LoginResponse>> signUp(@Valid @RequestBody SignupRequest signupRequest) {
        return authService.register(signupRequest);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoResponse>> getUserInfo() {
        return null;
    }
}
