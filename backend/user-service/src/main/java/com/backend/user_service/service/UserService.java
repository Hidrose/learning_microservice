package com.backend.user_service.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.user_service.dto.request.UserRequest;
import com.backend.user_service.dto.response.UserResponse;
import com.backend.user_service.entity.User;
import com.backend.user_service.exception.AppException;
import com.backend.user_service.exception.ErrorCode;
import com.backend.user_service.mapper.UserMapper;
import com.backend.user_service.repository.UserRepository;
import com.backend.user_service.utils.ValidationUtils;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UserResponse> getCustomers(int page, int limit, String q, Integer status) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        String role = "customer";

        Page<User> pageUser;

        if (q != null && !q.isBlank() && status != null) {
            pageUser = userRepository
                    .findByEmailContainingIgnoreCaseAndRoleAndStatus(q, role, status, pageable);
        } else if (q != null && !q.isBlank()) {
            pageUser = userRepository
                    .findByEmailContainingIgnoreCaseAndRole(q, role, pageable);
        } else if (status != null) {
            pageUser = userRepository
                    .findByRoleAndStatus(role, status, pageable);
        } else {
            pageUser = userRepository
                    .findByRole(role, pageable);
        }

        return pageUser.map(UserMapper::toResponse);
    }

    public Page<UserResponse> getAdmins(int page, int limit, String q, Integer status) {

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        List<String> roles = List.of("admin");

        Page<User> pageUser;

        if (q != null && !q.isBlank() && status != null) {
            pageUser = userRepository
                    .findByEmailContainingIgnoreCaseAndRoleInAndStatus(q, roles, status, pageable);
        } else if (q != null && !q.isBlank()) {
            pageUser = userRepository
                    .findByEmailContainingIgnoreCaseAndRoleIn(q, roles, pageable);
        } else if (status != null) {
            pageUser = userRepository
                    .findByRoleInAndStatus(roles, status, pageable);
        } else {
            pageUser = userRepository
                    .findByRoleIn(roles, pageable);
        }

        return pageUser.map(UserMapper::toResponse);
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return UserMapper.toResponse(user);
    }

    // kiểm tra email đã được sử dụng chưa
    public boolean existsUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // tạo user
    public void createUser(UserRequest request) {

        if (request.getEmail() != null &&
                !ValidationUtils.validateEmail(request.getEmail())) {
            throw new AppException(ErrorCode.INVALID_EMAIL);
        }

        if (request.getPhone() != null &&
                !ValidationUtils.validatePhone(request.getPhone())) {
            throw new AppException(ErrorCode.INVALID_PHONE);
        }

        if ((request.getPassword() == null || request.getPassword().isBlank())) {
            throw new AppException(ErrorCode.PASSWORD_REQUIRED);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.PHONE_ALREADY_USED);
        }

        User user = UserMapper.toEntity(request);
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setRole(
                request.getRole() == null ? "customer" : request.getRole());
        user.setStatus(
                request.getStatus() == null ? 1 : request.getStatus());

        userRepository.save(user);
    }

    // cập nhật user
    @Transactional
    public void updateUser(String id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getEmail() != null &&
                !ValidationUtils.validateEmail(request.getEmail())) {
            throw new AppException(ErrorCode.INVALID_EMAIL);
        }

        if (request.getPhone() != null &&
                !ValidationUtils.validatePhone(request.getPhone())) {
            throw new AppException(ErrorCode.INVALID_PHONE);
        }

        if (request.getPhone() != null) {
            userRepository.findByPhone(request.getPhone())
                    .filter(p -> !p.getId().equals(id))
                    .ifPresent(p -> {
                        throw new AppException(ErrorCode.PHONE_ALREADY_USED);
                    });
        }

        userRepository.findByEmail(request.getEmail())
                .filter(p -> !p.getId().equals(id))
                .ifPresent(p -> {
                    throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
                });

        UserMapper.updateEntity(user, request);

        user.setRole(
                request.getRole() == null ? "customer" : request.getRole());

        user.setStatus(
                request.getStatus() == null ? 1 : request.getStatus());

        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

    }

    // cập nhật status
    public void updateUserStatus(String id, Integer status) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setStatus(status);
        userRepository.save(user);
    }

    // xóa user
    public void deleteUser(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        userRepository.delete(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }
}
