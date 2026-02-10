package com.backend.assistant_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MomoResponse {
    private String payUrl;
    private String deeplink;
    private String qrCodeUrl;
    private String orderId;
    private int resultCode;
    private String message;
}
