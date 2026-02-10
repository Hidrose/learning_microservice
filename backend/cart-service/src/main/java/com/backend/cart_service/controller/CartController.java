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
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;

import com.backend.cart_service.dto.request.CartItemRequest;
import com.backend.cart_service.dto.response.CartResponse;
import com.backend.cart_service.service.CartService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication auth) {
        String userId = auth.getName();
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<CartResponse> addToCart(
            Authentication auth,
            @RequestBody @Valid CartItemRequest request) {

        String userId = auth.getName();
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @PutMapping
    public ResponseEntity<CartResponse> updateQuantity(
            Authentication auth,
            @RequestBody @Valid CartItemRequest request) {

        String userId = auth.getName();
        return ResponseEntity.ok(cartService.updateQuantity(userId, request));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<CartResponse> removeItem(
            Authentication auth,
            @PathVariable String productId) {

        String userId = auth.getName();
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
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
