package com.backend.order_service.dto.response;

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
public class ProductListItemResponse {
    private String id;
    private String name;
    private String slug;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal finalPrice;
    private Integer stock;
    private Integer status;
    private Integer totalSold;
    private String categoryName;
    private String brandName;
    private List<ImageProductResponse> images;
}
