package com.backend.auth_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.backend.auth_service.dto.request.UserRequest;
import com.backend.auth_service.dto.response.UserAuthResponse;
import com.backend.auth_service.dto.response.UserResponse;

import jakarta.validation.Valid;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/user/internal/{id}")
    UserResponse getUserByIdInternal(@PathVariable String id);

    @GetMapping("/api/user/internal/exist/user/{email}")
    Boolean existsUserByEmailInternal(@PathVariable String email);

    @PostMapping("/api/user/internal")
    UserResponse createUserInternal(@Valid @RequestBody UserRequest request);

    @GetMapping("/api/user/internal/email/{email}")
    UserAuthResponse getUserByEmailInternal(@PathVariable String email);
}
