package com.backend.auth_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.auth_service.client.UserServiceClient;
import com.backend.auth_service.dto.request.LoginRequest;
import com.backend.auth_service.dto.request.RegisterRequest;
import com.backend.auth_service.dto.response.LoginResponse;
import com.backend.auth_service.dto.response.UserResponse;
import com.backend.auth_service.exception.BadRequestException;
import com.backend.auth_service.service.AuthService;
import com.backend.auth_service.service.JwtService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserServiceClient userServiceClient;

    public AuthController(AuthService authService, JwtService jwtService, UserServiceClient userServiceClient) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userServiceClient = userServiceClient;
    }

    @PostMapping("/otp")
    public ResponseEntity<Void> sendRegisterOtp(
            @RequestParam String email) {

        authService.sendRegisterOtp(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> verifyOtpAndRegister(
            @Valid @RequestBody RegisterRequest request) {
        authService.verifyOtpAndRegister(
                request.getOtp(),
                request.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.handleLogin(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");

        if (!jwtService.isTokenValid(token)) {
            throw new BadRequestException("Token không hợp lệ");
        }

        String userId = jwtService.extractUserId(token);

        UserResponse user = userServiceClient.getUserByIdInternal(userId);

        return ResponseEntity.ok(user);
    }

}
