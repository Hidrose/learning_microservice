package com.backend.user_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAuthResponse {
    private String id;
    private String email;
    private String password; // hash
    private String role;
    private Integer status;
    private String fullname;
}
