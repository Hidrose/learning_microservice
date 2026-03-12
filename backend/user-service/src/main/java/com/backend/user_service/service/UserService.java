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
import com.backend.user_service.exception.BadRequestException;
import com.backend.user_service.exception.ConflictException;
import com.backend.user_service.exception.NotFoundException;
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
                .orElseThrow(() -> new NotFoundException("Người dùng không tìm thấy"));

        return UserMapper.toResponse(user);
    }

    // kiểm tra email đã được sử dụng chưa
    public boolean existsUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // tạo user
    public UserResponse createUser(UserRequest request) {

        if (request.getEmail() != null &&
                !ValidationUtils.validateEmail(request.getEmail())) {
            throw new BadRequestException("Email không hợp lệ");
        }

        if (request.getPhone() != null &&
                !ValidationUtils.validatePhone(request.getPhone())) {
            throw new BadRequestException("Số điện thoại không hợp lệ");
        }

        if ((request.getPassword() == null || request.getPassword().isBlank())) {
            throw new BadRequestException("Mật khẩu không được để trống");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email đã được sử dụng");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new ConflictException("Số điện thoại đã được sử dụng");
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

        return UserMapper.toResponse(user);
    }

    // cập nhật user
    @Transactional
    public UserResponse updateUser(String id, UserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Người dùng không tồn tại"));

        if (request.getEmail() != null &&
                !ValidationUtils.validateEmail(request.getEmail())) {
            throw new BadRequestException("Email không hợp lệ");
        }

        if (request.getPhone() != null &&
                !ValidationUtils.validatePhone(request.getPhone())) {
            throw new BadRequestException("Số điện thoại không hợp lệ");
        }

        if (request.getPhone() != null) {
            userRepository.findByPhone(request.getPhone())
                    .filter(p -> !p.getId().equals(id))
                    .ifPresent(p -> {
                        throw new ConflictException("Số điện thoại đã được sử dụng");
                    });
        }

        userRepository.findByEmail(request.getEmail())
                .filter(p -> !p.getId().equals(id))
                .ifPresent(p -> {
                    throw new ConflictException("Email đã được sử dụng");
                });

        UserMapper.updateEntity(user, request);

        user.setRole(
                request.getRole() == null ? "customer" : request.getRole());

        user.setStatus(
                request.getStatus() == null ? 1 : request.getStatus());

        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return UserMapper.toResponse(user);
    }

    // cập nhật status
    public UserResponse updateUserStatus(String id, Integer status) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Người dùng không tìm thấy"));

        user.setStatus(status);
        userRepository.save(user);

        return UserMapper.toResponse(user);
    }

    // xóa user
    public void deleteUser(String id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Người dùng không tìm thấy"));

        userRepository.delete(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Người dùng không tìm thấy"));
    }
}
