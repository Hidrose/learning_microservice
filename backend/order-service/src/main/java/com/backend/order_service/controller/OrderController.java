package com.backend.order_service.controller;

import java.time.LocalDate;
import java.util.Map;

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
import com.backend.order_service.dto.response.OrderResponse;
import com.backend.order_service.exception.BadRequestException;
import com.backend.order_service.service.OrderService;
import com.backend.order_service.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.ForbiddenException;

import org.springframework.validation.annotation.Validated;

@Validated
@RestController
@RequestMapping("/api/order")
public class OrderController {
        private final OrderService orderService;
        private final JwtUtil jwtUtil;

        public OrderController(OrderService orderService, JwtUtil jwtUtil) {
                this.orderService = orderService;
                this.jwtUtil = jwtUtil;
        }

        // admin
        @GetMapping
        public ResponseEntity<?> getOrders(
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
                                Map.of(
                                                "orders", orderPage.getContent(),
                                                "totalPages", orderPage.getTotalPages(),
                                                "total", orderPage.getTotalElements()));
        }

        @GetMapping("/{id}")
        public ResponseEntity<OrderResponse> getOrderById(
                        @PathVariable String id) {

                return ResponseEntity.ok(
                                orderService.getOrderById(id));
        }

        @PatchMapping("/status/{id}")
        public ResponseEntity<Void> updateOrderStatus(
                        @PathVariable String id,
                        @RequestParam Integer status) {

                orderService.updateOrderStatus(id, status);
                return ResponseEntity.noContent().build();
        }

        // customer
        @GetMapping("/user/{orderCode}")
        public ResponseEntity<OrderResponse> getUserOrderByCode(@PathVariable String orderCode,
                        HttpServletRequest request) {

                String userId = extractUserIdFromHeader(request);
                return ResponseEntity.ok(
                                orderService.getOrderByOrderCodeAndUser(orderCode, userId));
        }

        @GetMapping("/user")
        public ResponseEntity<?> getOrdersByUser(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "12") int limit,
                        @RequestParam(required = false) Integer status,
                        HttpServletRequest request) {

                String userId = extractUserIdFromHeader(request);

                Page<OrderResponse> orderPage = orderService.getOrdersByUser(userId, page, limit, status);

                return ResponseEntity.ok(
                                Map.of(
                                                "orders", orderPage.getContent(),
                                                "totalPages", orderPage.getTotalPages(),
                                                "total", orderPage.getTotalElements()));
        }

        @PostMapping("/user")
        public ResponseEntity<OrderResponse> createOrder(
                        @RequestBody OrderRequest order, HttpServletRequest request) {

                String userId = extractUserIdFromHeader(request);
                return ResponseEntity.ok(
                                orderService.createOrder(order, userId));
        }

        // Helper
        private String extractUserIdFromHeader(HttpServletRequest request) {
                String authHeader = request.getHeader("Authorization");

                if (authHeader == null || authHeader.isEmpty()) {
                        throw new BadRequestException("Authorization header không được để trống");
                }

                String token = authHeader.replace("Bearer ", "");

                if (!jwtUtil.isTokenValid(token)) {
                        throw new BadRequestException("Token không hợp lệ");
                }

                String role = jwtUtil.extractRole(token);
                if (!"customer".equals(role)) {
                        throw new ForbiddenException("Chỉ customer mới có thể truy cập");
                }

                return jwtUtil.extractUserId(token);
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
