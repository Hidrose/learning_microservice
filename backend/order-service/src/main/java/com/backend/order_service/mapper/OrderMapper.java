package com.backend.order_service.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.backend.order_service.dto.request.OrderRequest;
import com.backend.order_service.dto.response.OrderResponse;
import com.backend.order_service.dto.response.ProductListItemResponse;
import com.backend.order_service.entity.Order;
import com.backend.order_service.entity.OrderItem;

public final class OrderMapper {

        private OrderMapper() {
        }

        public static Order toEntity(
                        OrderRequest request,
                        String userId,
                        String orderCode) {

                Order order = Order.builder()
                                .orderCode(orderCode)
                                .fullname(request.getFullname())
                                .phone(request.getPhone())
                                .speaddress(request.getSpeaddress())
                                .city(request.getCity())
                                .ward(request.getWard())
                                .paymethod(request.getPaymethod())
                                .userId(userId)
                                .status(0)
                                .build();

                List<OrderItem> items = request.getItems()
                                .stream()
                                .map(item -> OrderItemMapper.toEntity(item, order))
                                .toList();

                order.setItems(items);
                order.setTotal(calculateTotal(items));

                return order;
        }

        public static OrderResponse toResponse(Order order) {

                return OrderResponse.builder()
                                .id(order.getId())
                                .orderCode(order.getOrderCode())
                                .userId(order.getUserId())
                                .fullname(order.getFullname())
                                .phone(order.getPhone())
                                .speaddress(order.getSpeaddress())
                                .city(order.getCity())
                                .ward(order.getWard())
                                .paymethod(order.getPaymethod())
                                .status(order.getStatus())
                                .total(order.getTotal())
                                .createdAt(order.getCreatedAt())
                                .items(
                                                order.getItems()
                                                                .stream()
                                                                .map(OrderItemMapper::toResponse)
                                                                .toList())
                                .build();
        }

        public static OrderResponse toResponse(
                        Order order,
                        Map<String, ProductListItemResponse> productMap) {

                OrderResponse response = toResponse(order);

                response.setItems(
                                order.getItems()
                                                .stream()
                                                .map(item -> {
                                                        ProductListItemResponse product = productMap
                                                                        .get(item.getProductId());

                                                        return OrderItemMapper.toResponse(item, product);
                                                })
                                                .toList());

                return response;
        }

        private static BigDecimal calculateTotal(List<OrderItem> items) {
                return items.stream()
                                .map(item -> item.getPrice()
                                                .subtract(item.getDiscount())
                                                .multiply(BigDecimal.valueOf(item.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
}
