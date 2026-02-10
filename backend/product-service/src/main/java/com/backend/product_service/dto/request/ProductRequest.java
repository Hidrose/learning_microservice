package com.backend.product_service.dto.request;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @Positive(message = "Giá phải > 0")
    private BigDecimal price;

    @Min(value = 0, message = "Giảm giá không hợp lệ")
    private BigDecimal discount;

    private String description;

    @NotNull(message = "Tình trạng không được để trống")
    private Integer status;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer stock;

    @NotBlank(message = "CategoryId không được để trống")
    private String categoryId;

    @NotBlank(message = "BrandId không được để trống")
    private String brandId;

    @Valid
    private List<ImageProductRequest> images;

    @Valid
    private List<SpecificationRequest> specifications;
}
