package com.backend.user_service.mapper;

import com.backend.user_service.dto.request.UserRequest;
import com.backend.user_service.dto.response.UserAuthResponse;
import com.backend.user_service.dto.response.UserResponse;
import com.backend.user_service.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(UserRequest request) {
        if (request == null) {
            return null;
        }

        return User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .fullname(request.getFullname())
                .phone(request.getPhone())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .role(request.getRole())
                .status(request.getStatus())
                .googleId(request.getGoogleId())
                .build();
    }

    public static UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .phone(user.getPhone())
                .birthDate(user.getBirthDate())
                .gender(user.getGender())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    public static UserAuthResponse toAuthResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserAuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .fullname(user.getFullname())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    public static void updateEntity(User user, UserRequest request) {
        if (user == null || request == null) {
            return;
        }

        user.setFullname(request.getFullname());
        user.setPhone(request.getPhone());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());
        user.setGoogleId(request.getGoogleId());

        if (request.getPassword() != null) {
            user.setPassword(request.getPassword());
        }
    }
}