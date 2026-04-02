package com.backend.user_service.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import com.backend.user_service.dto.request.UserRequest;
import com.backend.user_service.dto.response.ApiResponse;
import com.backend.user_service.dto.response.UserAuthResponse;
import com.backend.user_service.dto.response.UserResponse;
import com.backend.user_service.mapper.UserMapper;
import com.backend.user_service.service.UserService;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

@Validated
@RestController
@RequestMapping("/api/user")
public class UserController {
        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        @GetMapping("/customers")
        public ResponseEntity<ApiResponse<List<UserResponse>>> getCustomers(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status) {

                Page<UserResponse> userPage = userService.getCustomers(page, limit, q, status);

                return ResponseEntity.ok(
                                ApiResponse.<List<UserResponse>>builder()
                                                .message("Lấy danh sách khách hàng thành công")
                                                .data(userPage.getContent())
                                                .totalPages(userPage.getTotalPages())
                                                .total(userPage.getTotalElements())
                                                .build());
        }

        @GetMapping("/admins")
        public ResponseEntity<ApiResponse<List<UserResponse>>> getAdmins(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status) {

                Page<UserResponse> userPage = userService.getAdmins(page, limit, q, status);

                return ResponseEntity.ok(
                                ApiResponse.<List<UserResponse>>builder()
                                                .message("Lấy danh sách admin thành công")
                                                .data(userPage.getContent())
                                                .totalPages(userPage.getTotalPages())
                                                .total(userPage.getTotalElements())
                                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<UserResponse>> getUserById(
                        @PathVariable String id) {

                return ResponseEntity.ok(
                                ApiResponse.<UserResponse>builder()
                                                .message("Lấy thông tin người dùng thành công")
                                                .data(userService.getUserById(id))
                                                .build());
        }

        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> updateUser(
                        @PathVariable String id,
                        @Valid @RequestBody UserRequest request) {
                userService.updateUser(id, request);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Cập nhật người dùng thành công")
                                                .build());
        }

        @PatchMapping("/status/{id}")
        public ResponseEntity<ApiResponse<Void>> updateUserStatus(
                        @PathVariable String id,
                        @RequestParam @NotNull Integer status) {
                userService.updateUserStatus(id, status);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Cập nhật trạng thái thành công")
                                                .build());
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
                userService.deleteUser(id);

                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Xóa người dùng thành công")
                                                .build());
        }

        @PostMapping
        public ResponseEntity<ApiResponse<Void>> createUser(
                        @Valid @RequestBody UserRequest request) {

                userService.createUser(request);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.<Void>builder()
                                                .message("Tạo người dùng thành công")
                                                .build());
        }

        // internal
        @GetMapping("/internal/{id}")
        public ResponseEntity<UserResponse> getUserByIdInternal(
                        @PathVariable String id) {

                return ResponseEntity.ok(userService.getUserById(id));
        }

        @GetMapping("/internal/exist/user/{email}")
        public ResponseEntity<Boolean> existsUserByEmailInternal(
                        @PathVariable String email) {

                return ResponseEntity.ok(
                                userService.existsUserByEmail(email));
        }

        @GetMapping("/internal/email/{email}")
        public UserAuthResponse getUserByEmailInternal(@PathVariable String email) {
                return UserMapper.toAuthResponse(
                                userService.getUserByEmail(email));
        }

        @PostMapping("/internal")
        public ResponseEntity<Void> createUserInternal(
                        @Valid @RequestBody UserRequest request) {

                userService.createUser(request);
                return ResponseEntity.status(HttpStatus.CREATED).build();
        }
}
