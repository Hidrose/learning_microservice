package com.backend.payment_service.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private String id;
    private String orderCode;
    private String userId;
    private String email;
    private String fullname;
    private String phone;
    private String speaddress;
    private String city;
    private String ward;
    private String paymethod;
    private Integer status;
    private BigDecimal total;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
}
