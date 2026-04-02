package com.backend.product_service.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductAssistantResponse {
    private String id;
    private String name;
    private BigDecimal finalPrice;
    private String brandName;
    private String categoryName;
}
