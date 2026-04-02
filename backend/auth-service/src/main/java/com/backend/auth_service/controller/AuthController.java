package com.backend.auth_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.auth_service.client.UserServiceClient;
import com.backend.auth_service.dto.request.LoginRequest;
import com.backend.auth_service.dto.request.RegisterRequest;
import com.backend.auth_service.dto.response.ApiResponse;
import com.backend.auth_service.dto.response.LoginResponse;
import com.backend.auth_service.dto.response.UserResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.backend.auth_service.service.AuthService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/auth")
public class AuthController {
        private final AuthService authService;
        private final UserServiceClient userServiceClient;

        public AuthController(AuthService authService, UserServiceClient userServiceClient) {
                this.authService = authService;
                this.userServiceClient = userServiceClient;
        }

        @PostMapping("/otp")
        public ResponseEntity<ApiResponse<Void>> sendRegisterOtp(
                        @RequestParam String email) {

                authService.sendRegisterOtp(email);

                return ResponseEntity.ok(ApiResponse.<Void>builder()
                                .message("Mã OTP đã được gửi đến email " + email)
                                .build());
        }

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<Void>> verifyOtpAndRegister(
                        @Valid @RequestBody RegisterRequest request) {

                authService.verifyOtpAndRegister(request.getOtp(), request.getUser());

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<Void>builder()
                                                .message("Đăng ký tài khoản thành công")
                                                .build());
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> login(
                        @Valid @RequestBody LoginRequest request) {

                LoginResponse result = authService.handleLogin(request);

                return ResponseEntity.ok(
                                ApiResponse.<LoginResponse>builder()
                                                .message("Đăng nhập thành công")
                                                .data(result)
                                                .build());
        }

        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
                        @AuthenticationPrincipal String userId) {

                UserResponse user = userServiceClient.getUserByIdInternal(userId);
                return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                                .message("Lấy thông tin tài khoản thành công")
                                .data(user)
                                .build());
        }

        // assistant
        @GetMapping("/assistant/me")
        public ResponseEntity<UserResponse> getCurrentUserAssistant(
                        @AuthenticationPrincipal String userId) {

                UserResponse user = userServiceClient.getUserByIdInternal(userId);
                return ResponseEntity.ok(user);
        }

}
