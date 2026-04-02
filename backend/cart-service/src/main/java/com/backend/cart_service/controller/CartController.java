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
import com.backend.cart_service.dto.response.ApiResponse;
import com.backend.cart_service.dto.response.CartResponse;
import com.backend.cart_service.service.CartService;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@Validated
@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                ApiResponse.<CartResponse>builder()
                        .message("Lấy giỏ hàng thành công")
                        .data(cartService.getCartByUserId(userId))
                        .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addToCart(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid CartItemRequest itemRequest) {

        cartService.addToCart(userId, itemRequest);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Thêm sản phẩm vào giỏ hàng thành công")
                        .build());
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Void>> updateQuantity(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid CartItemRequest itemRequest) {

        cartService.updateQuantity(userId, itemRequest);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Cập nhật số lượng thành công")
                        .build());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeItem(
            @AuthenticationPrincipal String userId,
            @PathVariable String productId) {

        cartService.removeItem(userId, productId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .message("Xóa sản phẩm khỏi giỏ hàng thành công")
                        .build());
    }

    // assistant
    @GetMapping("/assistant")
    public ResponseEntity<CartResponse> getCartAssistant(
            @AuthenticationPrincipal String userId) {

        return ResponseEntity.ok(
                cartService.getCartByUserId(userId));
    }

    @PostMapping("/assistant")
    public ResponseEntity<Void> addToCartAssistant(
            @AuthenticationPrincipal String userId,
            @RequestBody @Valid CartItemRequest itemRequest) {

        cartService.addToCart(userId, itemRequest);
        return ResponseEntity.ok().build();
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
