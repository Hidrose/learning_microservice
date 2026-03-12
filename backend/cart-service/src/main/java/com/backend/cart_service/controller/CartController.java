package com.backend.cart_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

import com.backend.cart_service.dto.request.CartItemRequest;
import com.backend.cart_service.dto.response.CartResponse;
import com.backend.cart_service.exception.BadRequestException;
import com.backend.cart_service.service.CartService;
import com.backend.cart_service.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.ws.rs.ForbiddenException;

@Validated
@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;
    private final JwtUtil jwtUtil;

    public CartController(CartService cartService, JwtUtil jwtUtil) {
        this.cartService = cartService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(HttpServletRequest request) {
        String userId = extractUserIdFromHeader(request);

        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            HttpServletRequest request,
            @RequestBody @Valid CartItemRequest itemRequest) {

        String userId = extractUserIdFromHeader(request);
        return ResponseEntity.ok(cartService.addToCart(userId, itemRequest));
    }

    @PutMapping
    public ResponseEntity<CartResponse> updateQuantity(
            HttpServletRequest request,
            @RequestBody @Valid CartItemRequest itemRequest) {

        String userId = extractUserIdFromHeader(request);
        return ResponseEntity.ok(cartService.updateQuantity(userId, itemRequest));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<CartResponse> removeItem(
            HttpServletRequest request,
            @PathVariable String productId) {

        String userId = extractUserIdFromHeader(request);
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
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
    @DeleteMapping("/internal/all/{productId}")
    public ResponseEntity<Void> removeProductFromAllCartsInternal(@PathVariable String productId) {
        cartService.removeProductFromAllCarts(productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/internal/clear/{userId}")
    public ResponseEntity<Void> clearCartInternal(@PathVariable String userId) {
        cartService.clearCartByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
