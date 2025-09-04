package com.todolist.backend.services.User;

import com.todolist.backend.security.jwt.JwtPrincipal;
import com.todolist.backend.security.response.UserInfoResponse;

public interface UserService {
    UserInfoResponse me(JwtPrincipal principal);
}
