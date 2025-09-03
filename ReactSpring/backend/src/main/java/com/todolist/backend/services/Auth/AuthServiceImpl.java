package com.todolist.backend.services.Auth;

import com.todolist.backend.model.AppRole;
import com.todolist.backend.model.Role;
import com.todolist.backend.model.User;
import com.todolist.backend.repositories.RoleRepository;
import com.todolist.backend.repositories.UserRepository;
import com.todolist.backend.response.ApiResponse;
import com.todolist.backend.security.jwt.JwtUtils;
import com.todolist.backend.security.request.LoginRequest;
import com.todolist.backend.security.request.SignupRequest;
import com.todolist.backend.security.response.LoginResponse;
import com.todolist.backend.security.services.AuthUserDetails;
import com.todolist.backend.utils.EmailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final EmailSender emailSender;
    @Value("${app.mail.greetings}")
    private String greetingsMessage;

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public ResponseEntity<ApiResponse<LoginResponse>> authenticate(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        AuthUserDetails userDetails = (AuthUserDetails) authentication.getPrincipal();
        Set<String> roles = userDetails.authorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String token = jwtUtils.generateTokenFromPrincipal(userDetails, roles);
        ResponseCookie cookie = jwtUtils.getCookie(token);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());

        LoginResponse response = new LoginResponse(
                userDetails.getUserId(),
                userDetails.username(),
                roles
        );
        return new ResponseEntity<>(
                new ApiResponse<>(200, "Logged in successfully", response),
                headers,
                HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ApiResponse<LoginResponse>> register(SignupRequest signupRequest) {

        if (userRepository.existsUserByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        if (!signupRequest.getPassword().equals(signupRequest.getPasswordConfirm())) {
            throw new RuntimeException("Passwords don't match");
        }

        String encodedPassword = passwordEncoder.encode(signupRequest.getPassword());
        User user = new User(
                signupRequest.getUsername(),
                signupRequest.getEmail(),
                encodedPassword
        );

        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRole(userRole);
        User savedUser = userRepository.save(user);

        AuthUserDetails userDetails = AuthUserDetails.build(savedUser);
        Set<String> roles = userDetails.authorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String token = jwtUtils.generateTokenFromPrincipal(userDetails, roles);
        ResponseCookie cookie = jwtUtils.getCookie(token);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());

        emailSender.sendGreetingsMail(userDetails.email(), greetingsMessage);
        LoginResponse response = new LoginResponse(userDetails.getUserId(), userDetails.getUsername(), roles);
        return new ResponseEntity<>(
                new ApiResponse<>(201, "Registered successfully", response),
                headers,
                HttpStatus.OK
        );
    }
}
