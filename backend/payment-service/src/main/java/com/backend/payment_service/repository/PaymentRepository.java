package com.backend.payment_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.backend.payment_service.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
        Page<Payment> findByOrderCodeContainingIgnoreCaseAndStatus(
                        String orderCode,
                        Integer status,
                        Pageable pageable);

        Page<Payment> findByOrderCodeContainingIgnoreCase(
                        String orderCode,
                        Pageable pageable);

        Page<Payment> findByStatus(
                        Integer status,
                        Pageable pageable);

        Optional<Payment> findByOrderCode(String orderCode);
}
