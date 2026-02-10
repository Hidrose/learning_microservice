package com.backend.order_service.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.order_service.dto.request.OrderRequest;
import com.backend.order_service.dto.request.StockRequest;
import com.backend.order_service.dto.response.OrderResponse;
import com.backend.order_service.dto.response.ProductResponse;
import com.backend.order_service.entity.Order;
import com.backend.order_service.entity.OrderItem;
import com.backend.order_service.exception.BadRequestException;
import com.backend.order_service.exception.NotFoundException;
import com.backend.order_service.mapper.OrderMapper;
import com.backend.order_service.repository.OrderRepository;
import com.backend.order_service.utils.ValidationUtils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.backend.order_service.client.PaymentServiceClient;
import com.backend.order_service.client.ProductServiceClient;

@Service
public class OrderService {
        private final OrderRepository orderRepository;
        private final ProductServiceClient ProductServiceClient;
        private final PaymentServiceClient paymentServiceClient;

        public OrderService(OrderRepository orderRepository, ProductServiceClient ProductServiceClient,
                        PaymentServiceClient paymentServiceClient) {
                this.orderRepository = orderRepository;
                this.ProductServiceClient = ProductServiceClient;
                this.paymentServiceClient = paymentServiceClient;
        }

        // lấy tất cả đơn hàng phân trang
        public Page<OrderResponse> getOrders(
                        int page,
                        int limit,
                        String orderCode,
                        Integer status,
                        LocalDate start,
                        LocalDate end) {

                Pageable pageable = PageRequest.of(
                                page - 1,
                                limit,
                                Sort.by("createdAt").descending());

                LocalDateTime startDateTime = null;
                LocalDateTime endDateTime = null;

                if (start != null) {
                        startDateTime = start.atStartOfDay();
                }
                if (end != null) {
                        endDateTime = end.atTime(LocalTime.MAX);
                }

                Page<Order> orderPage;

                if (orderCode != null && !orderCode.isBlank()
                                && status != null
                                && startDateTime != null
                                && endDateTime != null) {

                        orderPage = orderRepository
                                        .findByOrderCodeContainingIgnoreCaseAndStatusAndCreatedAtBetween(
                                                        orderCode,
                                                        status,
                                                        startDateTime,
                                                        endDateTime,
                                                        pageable);

                } else if (orderCode != null && !orderCode.isBlank()
                                && startDateTime != null
                                && endDateTime != null) {

                        orderPage = orderRepository
                                        .findByOrderCodeContainingIgnoreCaseAndCreatedAtBetween(
                                                        orderCode,
                                                        startDateTime,
                                                        endDateTime,
                                                        pageable);

                } else if (status != null
                                && startDateTime != null
                                && endDateTime != null) {

                        orderPage = orderRepository
                                        .findByStatusAndCreatedAtBetween(
                                                        status,
                                                        startDateTime,
                                                        endDateTime,
                                                        pageable);

                } else if (startDateTime != null && endDateTime != null) {

                        orderPage = orderRepository
                                        .findByCreatedAtBetween(
                                                        startDateTime,
                                                        endDateTime,
                                                        pageable);

                } else if (orderCode != null && !orderCode.isBlank()
                                && status != null) {

                        orderPage = orderRepository
                                        .findByOrderCodeContainingIgnoreCaseAndStatus(
                                                        orderCode,
                                                        status,
                                                        pageable);

                } else if (orderCode != null && !orderCode.isBlank()) {

                        orderPage = orderRepository
                                        .findByOrderCodeContainingIgnoreCase(
                                                        orderCode,
                                                        pageable);

                } else if (status != null) {

                        orderPage = orderRepository
                                        .findByStatus(
                                                        status,
                                                        pageable);

                } else {
                        orderPage = orderRepository.findAll(pageable);
                }

                return orderPage.map(this::mapWithClient);
        }

        // lấy các đơn hàng của người dùng
        public Page<OrderResponse> getOrdersByUser(
                        String userId,
                        int page,
                        int limit,
                        Integer status) {

                Pageable pageable = PageRequest.of(
                                page - 1,
                                limit,
                                Sort.by("createdAt").descending());

                Page<Order> orderPage;

                if (status != null && status >= 0) {
                        orderPage = orderRepository
                                        .findByUserIdAndStatus(
                                                        userId,
                                                        status,
                                                        pageable);
                } else {
                        orderPage = orderRepository
                                        .findByUserIdAndStatusGreaterThanEqual(
                                                        userId,
                                                        0,
                                                        pageable);
                }

                return orderPage.map(this::mapWithClient);
        }

        // lấy 1 đơn hàng theo id
        public OrderResponse getOrderById(String id) {

                Order order = orderRepository.findById(id)
                                .orElseThrow(() -> new NotFoundException("Đơn hàng không tìm thấy"));

                return mapWithClient(order);
        }

        // lấy 1 đơn hàng theo orderCode
        public OrderResponse getOrderByOrderCode(String orderCode) {

                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException("Đơn hàng không tìm thấy"));

                return mapWithClient(order);
        }

        // lấy 1 đơn hàng theo orderCode của user id
        public OrderResponse getOrderByOrderCodeAndUser(
                        String orderCode,
                        String userId) {

                Order order = orderRepository
                                .findByOrderCodeAndUserId(orderCode, userId)
                                .orElseThrow(() -> new NotFoundException(
                                                "Đơn hàng không tồn tại hoặc không thuộc về bạn"));

                return mapWithClient(order);
        }

        // tạo đơn hàng
        @Transactional
        public OrderResponse createOrder(
                        OrderRequest request,
                        String userId) {

                if (!ValidationUtils.validatePhone(request.getPhone())) {
                        throw new BadRequestException("Số điện thoại không hợp lệ");
                }

                String orderCode = generateOrderCode();

                Order order = OrderMapper.toEntity(
                                request,
                                userId,
                                orderCode);

                // COD
                if ("cod".equalsIgnoreCase(request.getPaymethod())) {
                        order.setStatus(0); // chờ xác nhận

                        Order savedOrder = orderRepository.save(order);

                        // trừ tồn kho ngay
                        ProductServiceClient.decreaseStockInternal(
                                        buildStockRequests(savedOrder));

                        return OrderMapper.toResponse(savedOrder);
                }

                // MOMO
                order.setStatus(-1); // chờ thanh toán
                Order savedOrder = orderRepository.save(order);

                return OrderMapper.toResponse(savedOrder);
        }

        // cập nhật status đơn hàng
        @Transactional
        public void updateOrderStatus(
                        String orderId,
                        Integer status) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new NotFoundException("Đơn hàng không tìm thấy"));

                Integer oldStatus = order.getStatus();

                // trả hàng
                if (status == 5 && oldStatus != 5) {

                        // hoàn tiền nếu là momo
                        if ("momo".equalsIgnoreCase(order.getPaymethod())) {
                                paymentServiceClient.refundMomoByOrderCodeInternal(order.getOrderCode());
                        }

                        // trả tồn kho
                        ProductServiceClient.increaseStockInternal(
                                        buildStockRequests(order));
                }

                // hủy đơn
                if (status == 4 && oldStatus != 4) {
                        if ("cod".equalsIgnoreCase(order.getPaymethod())) {
                                ProductServiceClient.increaseStockInternal(
                                                buildStockRequests(order));
                        }
                }

                order.setStatus(status);
                orderRepository.save(order);
        }

        private String generateOrderCode() {
                String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                Random random = new Random();
                StringBuilder sb = new StringBuilder();
                sb.append("ORD");
                for (int i = 0; i < 5; i++) {
                        sb.append(chars.charAt(random.nextInt(chars.length())));
                }
                return sb.toString();
        }

        private OrderResponse mapWithClient(Order order) {

                List<String> productIds = order.getItems()
                                .stream()
                                .map(OrderItem::getProductId)
                                .distinct()
                                .toList();

                List<ProductResponse> products = ProductServiceClient.getProductsByIdsInternal(productIds);

                Map<String, ProductResponse> productMap = products.stream()
                                .collect(Collectors.toMap(
                                                ProductResponse::getId,
                                                p -> p));

                return OrderMapper.toResponse(order, productMap);
        }

        private List<StockRequest> buildStockRequests(Order order) {
                return order.getItems().stream()
                                .map(item -> new StockRequest(
                                                item.getProductId(),
                                                item.getQuantity()))
                                .toList();
        }

        // xóa đơn hàng
        @Transactional
        public void deleteOrderByCode(String orderCode) {
                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException("Đơn hàng không tìm thấy"));

                orderRepository.delete(order);
        }

        @Transactional
        public void confirmGatewayPayment(String orderCode) {

                Order order = orderRepository.findByOrderCode(orderCode)
                                .orElseThrow(() -> new NotFoundException("Đơn hàng không tìm thấy"));

                if (order.getStatus() != -1) {
                        return;
                }

                // trừ tồn kho
                ProductServiceClient.decreaseStockInternal(
                                buildStockRequests(order));

                order.setStatus(0);
                orderRepository.save(order);
        }

        public boolean existsOrderByProductId(String productId) {
                return orderRepository.existsByItems_ProductId(productId);
        }
}
