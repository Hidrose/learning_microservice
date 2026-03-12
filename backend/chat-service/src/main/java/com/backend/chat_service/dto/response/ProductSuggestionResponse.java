package com.backend.chat_service.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSuggestionResponse {
    private String id;
    private String name;
    private String slug;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private String image;
    private Integer stock;
}
