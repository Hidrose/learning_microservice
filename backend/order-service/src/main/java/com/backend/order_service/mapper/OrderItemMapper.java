package com.backend.order_service.mapper;

import java.math.BigDecimal;
import java.util.List;

import com.backend.order_service.dto.request.OrderItemRequest;
import com.backend.order_service.dto.response.ImageProductResponse;
import com.backend.order_service.dto.response.OrderItemResponse;
import com.backend.order_service.dto.response.ProductResponse;
import com.backend.order_service.entity.Order;
import com.backend.order_service.entity.OrderItem;

public final class OrderItemMapper {

    private OrderItemMapper() {
    }

    public static OrderItem toEntity(
            OrderItemRequest request,
            Order order) {

        return OrderItem.builder()
                .order(order)
                .quantity(request.getQuantity())
                .price(request.getPrice())
                .discount(
                        request.getDiscount() == null
                                ? BigDecimal.ZERO
                                : request.getDiscount())
                .build();
    }

    public static OrderItemResponse toResponse(OrderItem item) {

        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(null)
                .name(null)
                .images(null)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .discount(item.getDiscount())
                .build();
    }

    public static OrderItemResponse toResponse(
            OrderItem item,
            ProductResponse product) {

        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .name(product != null ? product.getName() : null)
                .images(
                        product != null && product.getImages() != null
                                ? product.getImages()
                                        .stream()
                                        .map(ImageProductResponse::getImage)
                                        .toList()
                                : List.of())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .discount(item.getDiscount())
                .build();
    }

}
