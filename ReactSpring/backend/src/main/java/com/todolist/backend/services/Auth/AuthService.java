package com.todolist.backend.services.Auth;

import com.todolist.backend.response.ApiResponse;
import com.todolist.backend.security.request.LoginRequest;
import com.todolist.backend.security.request.SignupRequest;
import com.todolist.backend.security.response.UserInfoResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<ApiResponse<UserInfoResponse>> authenticate(LoginRequest loginRequest);

    ResponseEntity<ApiResponse<UserInfoResponse>> register(SignupRequest signupRequest);
}
