package com.backend.order_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import com.backend.order_service.dto.request.OrderRequest;
import com.backend.order_service.dto.response.ApiResponse;
import com.backend.order_service.dto.response.OrderResponse;
import com.backend.order_service.service.OrderService;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@Validated
@RestController
@RequestMapping("/api/order")
public class OrderController {
        private final OrderService orderService;

        public OrderController(OrderService orderService) {
                this.orderService = orderService;
        }

        // admin
        @GetMapping
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) String q,
                        @RequestParam(required = false) Integer status,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

                Page<OrderResponse> orderPage = orderService.getOrders(
                                page,
                                limit,
                                q,
                                status,
                                start,
                                end);

                return ResponseEntity.ok(
                                ApiResponse.<List<OrderResponse>>builder()
                                                .message("Lấy danh sách đơn hàng thành công")
                                                .data(orderPage.getContent())
                                                .totalPages(orderPage.getTotalPages())
                                                .total(orderPage.getTotalElements())
                                                .build());
        }

        @GetMapping("/{id}")
        public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
                        @PathVariable String id) {

                return ResponseEntity.ok(
                                ApiResponse.<OrderResponse>builder()
                                                .message("Lấy chi tiết đơn hàng thành công")
                                                .data(orderService.getOrderById(id))
                                                .build());
        }

        @PatchMapping("/status/{id}")
        public ResponseEntity<ApiResponse<Void>> updateOrderStatus(
                        @PathVariable String id,
                        @RequestParam Integer status) {

                orderService.updateOrderStatus(id, status);
                return ResponseEntity.ok(
                                ApiResponse.<Void>builder()
                                                .message("Cập nhật trạng thái đơn hàng thành công")
                                                .build());
        }

        // customer
        @GetMapping("/user/{orderCode}")
        public ResponseEntity<ApiResponse<OrderResponse>> getUserOrderByCode(@PathVariable String orderCode,
                        @AuthenticationPrincipal String userId) {

                return ResponseEntity.ok(
                                ApiResponse.<OrderResponse>builder()
                                                .message("Lấy đơn hàng của bạn thành công")
                                                .data(orderService.getOrderByOrderCodeAndUser(orderCode, userId))
                                                .build());
        }

        @GetMapping("/user")
        public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByUser(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) Integer status,
                        @AuthenticationPrincipal String userId) {

                Page<OrderResponse> orderPage = orderService.getOrdersByUser(userId, page, limit, status);

                return ResponseEntity.ok(
                                ApiResponse.<List<OrderResponse>>builder()
                                                .message("Lấy danh sách đơn hàng của bạn thành công")
                                                .data(orderPage.getContent())
                                                .totalPages(orderPage.getTotalPages())
                                                .total(orderPage.getTotalElements())
                                                .build());
        }

        @PostMapping("/user")
        public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
                        @RequestBody OrderRequest order, @AuthenticationPrincipal String userId) {

                return ResponseEntity.ok(
                                ApiResponse.<OrderResponse>builder()
                                                .message("Tạo đơn hàng thành công")
                                                .data(orderService.createOrder(order, userId))
                                                .build());
        }

        // assistant
        @GetMapping("/assistant/user/{orderCode}")
        public ResponseEntity<OrderResponse> getUserOrderByCodeAssistant(
                        @PathVariable String orderCode,
                        @AuthenticationPrincipal String userId) {

                return ResponseEntity.ok(
                                orderService.getOrderByOrderCodeAndUser(orderCode, userId));
        }

        @GetMapping("/assistant/user")
        public ResponseEntity<List<OrderResponse>> getOrdersByUserAssistant(
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) Integer status,
                        @AuthenticationPrincipal String userId) {

                Page<OrderResponse> orderPage = orderService.getOrdersByUser(userId, 1, limit, status);

                return ResponseEntity.ok(orderPage.getContent());
        }

        // Internal
        @GetMapping("/internal/code/{orderCode}")
        public ResponseEntity<OrderResponse> getOrderByOrderCodeInternal(
                        @PathVariable String orderCode) {

                return ResponseEntity.ok(
                                orderService.getOrderByOrderCode(orderCode));
        }

        @PatchMapping("/internal/status/{id}")
        public ResponseEntity<Void> updateOrderStatusInternal(
                        @PathVariable String id,
                        @RequestParam Integer status) {

                orderService.updateOrderStatus(id, status);
                return ResponseEntity.noContent().build();
        }

        @DeleteMapping("/internal/{orderCode}")
        public ResponseEntity<Void> deleteOrderByCodeInternal(
                        @PathVariable String orderCode) {

                orderService.deleteOrderByCode(orderCode);
                return ResponseEntity.noContent().build();
        }

        @PostMapping("/internal/payment/{orderCode}")
        public ResponseEntity<Void> confirmGatewayPaymentInternal(
                        @PathVariable String orderCode) {

                orderService.confirmGatewayPayment(orderCode);
                return ResponseEntity.ok().build();
        }

        @GetMapping("/internal/exists/{productId}")
        public ResponseEntity<Boolean> existsProductInOrderInternal(
                        @PathVariable String productId) {

                return ResponseEntity.ok(
                                orderService.existsOrderByProductId(productId));
        }
}
