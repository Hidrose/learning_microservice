package com.backend.product_service.mapper;

import java.util.List;
import java.util.stream.Collectors;

import com.backend.product_service.dto.request.ProductRequest;
import com.backend.product_service.dto.response.BrandResponse;
import com.backend.product_service.dto.response.BrandSimpleResponse;
import com.backend.product_service.dto.response.CategoryResponse;
import com.backend.product_service.dto.response.CategorySimpleResponse;
import com.backend.product_service.dto.response.ImageProductResponse;
import com.backend.product_service.dto.response.ProductAssistantResponse;
import com.backend.product_service.dto.response.ProductDetailResponse;
import com.backend.product_service.dto.response.ProductListItemResponse;
import com.backend.product_service.dto.response.SpecificationResponse;
import com.backend.product_service.entity.ImageProduct;
import com.backend.product_service.entity.Product;
import com.backend.product_service.entity.Specification;

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

        public static ProductListItemResponse toListItemResponse(
                        Product product,
                        CategoryResponse category,
                        BrandResponse brand) {

                return ProductListItemResponse.builder()
                                .id(product.getId())
                                .name(product.getName())
                                .slug(product.getSlug())
                                .price(product.getPrice())
                                .discount(product.getDiscount())
                                .finalPrice(product.getFinalPrice())
                                .stock(product.getStock())
                                .status(product.getStatus())
                                .totalSold(product.getTotalSold())
                                .categoryName(category != null ? category.getName() : null)
                                .brandName(brand != null ? brand.getName() : null)
                                .images(mapImages(product))
                                .build();
        }

        public static ProductDetailResponse toDetailResponse(
                        Product product,
                        CategoryResponse category,
                        BrandResponse brand) {

                CategorySimpleResponse categorySimple = category == null ? null
                                : CategorySimpleResponse.builder()
                                                .id(category.getId())
                                                .name(category.getName())
                                                .slug(category.getSlug())
                                                .build();

                BrandSimpleResponse brandSimple = brand == null ? null
                                : BrandSimpleResponse.builder()
                                                .id(brand.getId())
                                                .name(brand.getName())
                                                .slug(brand.getSlug())
                                                .build();

                return ProductDetailResponse.builder()
                                .id(product.getId())
                                .name(product.getName())
                                .slug(product.getSlug())
                                .price(product.getPrice())
                                .discount(product.getDiscount())
                                .finalPrice(product.getFinalPrice())
                                .description(product.getDescription())
                                .status(product.getStatus())
                                .stock(product.getStock())
                                .category(categorySimple)
                                .brand(brandSimple)
                                .images(mapImages(product))
                                .specifications(mapSpecifications(product))
                                .build();
        }

        private static List<ImageProductResponse> mapImages(Product product) {
                if (product.getImages() == null)
                        return List.of();
                return product.getImages().stream()
                                .sorted(Comparator.comparing(
                                                ImageProduct::getDisplayOrder,
                                                Comparator.nullsLast(Comparator.naturalOrder())))
                                .map(ImageProductMapper::toResponse)
                                .toList();
        }

        private static List<SpecificationResponse> mapSpecifications(Product product) {
                if (product.getSpecifications() == null)
                        return List.of();
                return product.getSpecifications().stream()
                                .sorted(Comparator.comparing(
                                                Specification::getDisplayOrder,
                                                Comparator.nullsLast(Comparator.naturalOrder())))
                                .map(SpecificationMapper::toResponse)
                                .toList();
        }

        public static ProductAssistantResponse toAssistantResponse(
                        Product product,
                        CategoryResponse category,
                        BrandResponse brand) {

                return ProductAssistantResponse.builder()
                                .id(product.getId())
                                .name(product.getName())
                                .finalPrice(product.getFinalPrice())
                                .categoryName(category != null ? category.getName() : null)
                                .brandName(brand != null ? brand.getName() : null)
                                .build();
        }
}