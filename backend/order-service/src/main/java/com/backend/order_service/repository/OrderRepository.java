package com.backend.order_service.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.order_service.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
        Page<Order> findByOrderCodeContainingIgnoreCase(String orderCode, Pageable pageable);

        Page<Order> findByStatus(Integer status, Pageable pageable);

        Page<Order> findByOrderCodeContainingIgnoreCaseAndStatus(
                        String orderCode,
                        Integer status,
                        Pageable pageable);

        Page<Order> findByCreatedAtBetween(
                        LocalDateTime start,
                        LocalDateTime end,
                        Pageable pageable);

        Page<Order> findByStatusAndCreatedAtBetween(
                        Integer status,
                        LocalDateTime start,
                        LocalDateTime end,
                        Pageable pageable);

        Page<Order> findByOrderCodeContainingIgnoreCaseAndCreatedAtBetween(
                        String orderCode,
                        LocalDateTime start,
                        LocalDateTime end,
                        Pageable pageable);

        Page<Order> findByOrderCodeContainingIgnoreCaseAndStatusAndCreatedAtBetween(
                        String orderCode,
                        Integer status,
                        LocalDateTime start,
                        LocalDateTime end,
                        Pageable pageable);

        Page<Order> findByUserIdAndStatus(
                        String userId,
                        Integer status,
                        Pageable pageable);

        Page<Order> findByUserIdAndStatusGreaterThanEqual(
                        String userId,
                        Integer status,
                        Pageable pageable);

        Optional<Order> findByOrderCode(String orderCode);

        boolean existsByItems_ProductId(String productId);

        Optional<Order> findByOrderCodeAndUserId(String orderCode, String userId);
}
