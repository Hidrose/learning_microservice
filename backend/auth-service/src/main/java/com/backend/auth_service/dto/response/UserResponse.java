package com.backend.auth_service.dto.response;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String fullname;
    private String phone;
    private LocalDate birthDate;
    private Integer gender;
    private String role;
    private Integer status;
}
