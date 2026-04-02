package com.backend.cart_service.mapper;

import java.util.List;

import com.backend.cart_service.dto.request.CartItemRequest;
import com.backend.cart_service.dto.response.CartItemResponse;
import com.backend.cart_service.dto.response.CartResponse;
import com.backend.cart_service.dto.response.ImageProductResponse;
import com.backend.cart_service.dto.response.ProductListItemResponse;
import com.backend.cart_service.model.Cart;
import com.backend.cart_service.model.CartItem;

public final class CartMapper {

        private CartMapper() {
        }

        public static CartResponse toResponse(
                        Cart cart,
                        List<CartItemResponse> items) {

                return CartResponse.builder()
                                .id(cart.getId())
                                .userId(cart.getUserId())
                                .items(items)
                                .build();
        }

        public static CartItemResponse toItemResponse(
                        CartItem cartItem,
                        ProductListItemResponse product) {

                return CartItemResponse.builder()
                                .productId(product.getId())
                                .name(product.getName())
                                .slug(product.getSlug())
                                .images(
                                                product.getImages() == null
                                                                ? List.of()
                                                                : product.getImages().stream()
                                                                                .map(ImageProductResponse::getImage)
                                                                                .toList())
                                .price(product.getPrice())
                                .discount(product.getDiscount())
                                .quantity(cartItem.getQuantity())
                                .stock(product.getStock())
                                .status(product.getStatus())
                                .build();
        }

        public static CartItem toItemEntity(CartItemRequest request) {

                return CartItem.builder()
                                .productId(request.getProductId())
                                .quantity(request.getQuantity())
                                .build();
        }
}
