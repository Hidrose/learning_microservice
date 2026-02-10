package com.backend.auth_service.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.auth_service.client.UserServiceClient;
import com.backend.auth_service.dto.request.LoginRequest;
import com.backend.auth_service.dto.request.UserRequest;
import com.backend.auth_service.dto.request.VerifyOtpRequest;
import com.backend.auth_service.dto.response.LoginResponse;
import com.backend.auth_service.dto.response.UserAuthResponse;
import com.backend.auth_service.entity.Otp;
import com.backend.auth_service.exception.BadRequestException;
import com.backend.auth_service.exception.ConflictException;
import com.backend.auth_service.repository.AuthRepository;
import com.backend.auth_service.util.OtpUtil;
import com.backend.auth_service.util.ValidationUtils;

import feign.FeignException;
import jakarta.ws.rs.ForbiddenException;

@Service
public class AuthService {
    private final AuthRepository authRepository;
    private final UserServiceClient userServiceClient;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AuthRepository authRepository, UserServiceClient userServiceClient,
            EmailService emailService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.authRepository = authRepository;
        this.emailService = emailService;
        this.userServiceClient = userServiceClient;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Gửi otp đến email
    @Transactional
    public void sendRegisterOtp(String email) {

        if (!ValidationUtils.validateEmail(email)) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }

        if (userServiceClient.existsUserByEmailInternal(email)) {
            throw new ConflictException("Email đã được sử dụng");
        }

        String otp = OtpUtil.generateOtp();

        String hashedOtp = passwordEncoder.encode(otp);

        authRepository.findByEmail(email).ifPresent(existing -> {
            if (existing.getExpiredAt().isAfter(LocalDateTime.now().minusMinutes(5))) {
                throw new BadRequestException("Vui lòng đợi 5 phút trước khi gửi lại OTP");
            }
            authRepository.delete(existing);
        });

        Otp otpEntity = Otp.builder()
                .email(email)
                .otp(hashedOtp)
                .expiredAt(LocalDateTime.now().plusMinutes(10))
                .build();

        authRepository.save(otpEntity);

        // Gửi otp đến email
        emailService.sendOtp(email, otp);
    }

    // Xác thực otp để đăng ký
    @Transactional
    public void verifyOtpAndRegister(
            VerifyOtpRequest otpRequest,
            UserRequest userRequest) {

        if (!otpRequest.getEmail().equals(userRequest.getEmail())) {
            throw new BadRequestException("OTP và email đăng ký không khớp");
        }

        if (!ValidationUtils.validateEmail(userRequest.getEmail())) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }

        Otp otp = authRepository.findByEmail(otpRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("OTP không tồn tại"));

        if (otp.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP đã hết hạn");
        }

        if (!passwordEncoder.matches(otpRequest.getOtp(), otp.getOtp())) {

            otp.setFailedAttempts(otp.getFailedAttempts() + 1);

            if (otp.getFailedAttempts() >= 5) {
                authRepository.delete(otp);
                throw new BadRequestException("Bạn đã nhập sai OTP quá 5 lần. Vui lòng gửi lại mã mới");
            }

            authRepository.save(otp);
            throw new BadRequestException("OTP không đúng");
        }

        userServiceClient.createUserInternal(userRequest);

        authRepository.deleteByEmail(otpRequest.getEmail());
    }

    // đăng nhập thủ công
    public LoginResponse handleLogin(LoginRequest request) {

        UserAuthResponse user;

        try {
            user = userServiceClient.getUserByEmailInternal(request.getEmail());
        } catch (FeignException.NotFound e) {
            throw new BadRequestException("Email hoặc mật khẩu không đúng");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Email hoặc mật khẩu không đúng");
        }

        if (user.getStatus() != null && user.getStatus() == 0) {
            throw new ForbiddenException("Tài khoản đã bị khóa");
        }

        String token = jwtService.generateAccessToken(user);

        return LoginResponse.builder()
                .token(token)
                .role(user.getRole())
                .build();
    }

    // đăng nhập google (tạm bỏ)

    @Scheduled(fixedRate = 60_000) // mỗi 1 phút
    @Transactional
    public void cleanupExpiredOtp() {
        authRepository.deleteExpiredOtp(LocalDateTime.now());
    }
}
