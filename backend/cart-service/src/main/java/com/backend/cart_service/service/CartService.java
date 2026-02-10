package com.backend.cart_service.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.cart_service.client.ProductServiceClient;
import com.backend.cart_service.dto.request.CartItemRequest;
import com.backend.cart_service.dto.response.CartItemResponse;
import com.backend.cart_service.dto.response.CartResponse;
import com.backend.cart_service.dto.response.ProductResponse;
import com.backend.cart_service.exception.BadRequestException;
import com.backend.cart_service.exception.NotFoundException;
import com.backend.cart_service.mapper.CartMapper;
import com.backend.cart_service.model.Cart;
import com.backend.cart_service.model.CartItem;
import com.backend.cart_service.repository.CartRepository;

@Service
public class CartService {
    private static final String CART_KEY_PREFIX = "cart:";
    private final CartRepository cartRepository;
    private final ProductServiceClient productServiceClient;
    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    public CartService(
            CartRepository cartRepository,
            ProductServiceClient productServiceClient) {
        this.cartRepository = cartRepository;
        this.productServiceClient = productServiceClient;
    }

    // lấy giỏ hàng của user
    public CartResponse getCartByUserId(String userId) {
        Cart cart = getCartFromRedis(userId);

        if (cart == null) {
            cart = cartRepository.findByUserId(userId)
                    .orElseGet(() -> cartRepository.save(
                            Cart.builder()
                                    .userId(userId)
                                    .items(new ArrayList<>())
                                    .build()));
            saveCartToRedis(userId, cart);
        }

        if (cart.getItems().isEmpty()) {
            return CartMapper.toResponse(cart, List.of());
        }

        List<String> productIds = cart.getItems()
                .stream()
                .map(CartItem::getProductId)
                .toList();

        List<ProductResponse> products = productServiceClient.getProductsByIdsInternal(productIds);

        Map<String, ProductResponse> productMap = products.stream()
                .collect(Collectors.toMap(ProductResponse::getId, p -> p));

        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> {
                    ProductResponse product = productMap.get(item.getProductId());
                    if (product == null) {
                        throw new NotFoundException("Sản phẩm không tồn tại");
                    }
                    return CartMapper.toItemResponse(item, product);
                })
                .toList();

        return CartMapper.toResponse(cart, items);
    }

    // thêm sản phẩm vào giỏ hàng
    public CartResponse addToCart(String userId, CartItemRequest request) {

        if (request.getQuantity() < 1) {
            throw new BadRequestException("Số lượng phải lớn hơn hoặc bằng 1");
        }

        Cart cart = getCartFromRedis(userId);

        if (cart == null) {
            cart = cartRepository.findByUserId(userId)
                    .orElseGet(() -> Cart.builder()
                            .userId(userId)
                            .items(new ArrayList<>())
                            .build());
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            cart.getItems().add(CartMapper.toItemEntity(request));
        }

        cart = cartRepository.save(cart);

        saveCartToRedis(userId, cart);

        return getCartByUserId(userId);
    }

    // xóa sản phẩm khỏi giỏ hàng
    public CartResponse removeItem(String userId, String productId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Giỏ hàng không tìm thấy"));

        boolean removed = cart.getItems()
                .removeIf(item -> item.getProductId().equals(productId));

        if (!removed) {
            throw new NotFoundException("Sản phẩm không có trong giỏ hàng");
        }

        cart = cartRepository.save(cart);
        saveCartToRedis(userId, cart);

        return getCartByUserId(userId);
    }

    // cập nhật số lượng sản phẩm trong giỏ hàng
    public CartResponse updateQuantity(
            String userId,
            CartItemRequest request) {

        if (request.getQuantity() < 1) {
            throw new BadRequestException("Số lượng phải lớn hơn hoặc bằng 1");
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Giỏ hàng không tìm thấy"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Sản phẩm không có trong giỏ"));

        item.setQuantity(request.getQuantity());

        cart = cartRepository.save(cart);
        saveCartToRedis(userId, cart);

        return getCartByUserId(userId);
    }

    // xóa sản phẩm có id đó khỏi tất cả giỏ hàng
    @Transactional
    public void removeProductFromAllCarts(String productId) {

        List<Cart> carts = cartRepository.findByItemsProductId(productId);

        if (carts.isEmpty()) {
            return;
        }

        for (Cart cart : carts) {

            boolean removed = cart.getItems()
                    .removeIf(item -> item.getProductId().equals(productId));

            if (removed) {
                cartRepository.save(cart);

                if (redisTemplate != null) {
                    redisTemplate.delete(CART_KEY_PREFIX + cart.getUserId());
                }

            }
        }
    }

    @Transactional
    public void clearCartByUserId(String userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);

        if (cart == null) {
            return;
        }

        cart.getItems().clear();
        cartRepository.save(cart);

        if (redisTemplate != null) {
            redisTemplate.delete(CART_KEY_PREFIX + userId);
        }

    }

    private Cart getCartFromRedis(String userId) {
        if (redisTemplate == null) {
            return null;
        }
        return (Cart) redisTemplate.opsForValue()
                .get(CART_KEY_PREFIX + userId);
    }

    private void saveCartToRedis(String userId, Cart cart) {
        if (redisTemplate == null) {
            return;
        }
        redisTemplate.opsForValue()
                .set(CART_KEY_PREFIX + userId, cart);
    }

}
