package com.backend.product_service.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.backend.product_service.dto.request.ProductRequest;
import com.backend.product_service.dto.response.BrandResponse;
import com.backend.product_service.dto.response.CategoryResponse;
import com.backend.product_service.dto.response.ProductResponse;
import com.backend.product_service.entity.ImageProduct;
import com.backend.product_service.entity.Product;
import java.util.Comparator;

public final class ProductMapper {

        private ProductMapper() {
        }

        public static Product toEntity(ProductRequest request) {
                if (request == null)
                        return null;

                Product product = Product.builder()
                                .name(request.getName())
                                .price(request.getPrice())
                                .discount(request.getDiscount())
                                .description(request.getDescription())
                                .status(request.getStatus())
                                .stock(request.getStock())
                                .categoryId(request.getCategoryId())
                                .brandId(request.getBrandId())
                                .build();

                if (request.getImages() != null) {
                        product.setImages(
                                        request.getImages().stream()
                                                        .map(ImageProductMapper::toEntity)
                                                        .collect(Collectors.toSet()));
                }

                if (request.getSpecifications() != null) {
                        product.setSpecifications(
                                        request.getSpecifications().stream()
                                                        .map(SpecificationMapper::toEntity)
                                                        .collect(Collectors.toSet()));
                }

                return product;
        }

        public static void updateEntity(Product product, ProductRequest request) {

                product.setName(request.getName());
                product.setPrice(request.getPrice());
                product.setDiscount(request.getDiscount());
                product.setDescription(request.getDescription());
                product.setStatus(request.getStatus());
                product.setStock(request.getStock());
                product.setCategoryId(request.getCategoryId());
                product.setBrandId(request.getBrandId());
        }

        public static ProductResponse toResponse(Product product) {

                return ProductResponse.builder()
                                .id(product.getId())
                                .name(product.getName())
                                .slug(product.getSlug())
                                .price(product.getPrice())
                                .discount(product.getDiscount())
                                .finalPrice(product.getFinalPrice())
                                .description(product.getDescription())
                                .status(product.getStatus())
                                .stock(product.getStock())
                                .totalSold(product.getTotalSold())
                                .images(
                                                product.getImages() == null
                                                                ? List.of()
                                                                : product.getImages().stream()
                                                                                .sorted(
                                                                                                Comparator.comparing(
                                                                                                                ImageProduct::getCreatedAt,
                                                                                                                Comparator.nullsLast(
                                                                                                                                Comparator.naturalOrder())))

                                                                                .map(ImageProductMapper::toResponse)
                                                                                .toList())
                                .specifications(
                                                product.getSpecifications() == null
                                                                ? List.of()
                                                                : product.getSpecifications().stream()
                                                                                .map(SpecificationMapper::toResponse)
                                                                                .toList())
                                .build();
        }

        public static ProductResponse toResponse(
                        Product product,
                        CategoryResponse category,
                        BrandResponse brand) {

                ProductResponse response = toResponse(product);
                response.setCategory(category);
                response.setBrand(brand);
                return response;
        }
}