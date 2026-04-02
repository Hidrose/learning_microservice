package com.backend.product_service.dto.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductQueryRequest {
    private String keyword;
    private String category;
    private String brand;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    private Boolean isDiscount;
    private Boolean isBestseller;
     private Boolean inStock;

    private Integer limit;
    private String sortBy;
}
