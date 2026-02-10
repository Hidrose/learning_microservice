package com.backend.cart_service.dto.response;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private String id;
    private String name;
    private String slug;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private String description;
    private Integer status;
    private Integer stock;
    private Integer totalSold;
    private CategoryResponse category;
    private BrandResponse brand;
    private List<ImageProductResponse> images;
    private List<SpecificationResponse> specifications;
}
