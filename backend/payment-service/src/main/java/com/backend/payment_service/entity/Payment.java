package com.backend.payment_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment", indexes = {
        @Index(name = "idx_payment_order", columnList = "orderId"),
        @Index(name = "idx_payment_order_code", columnList = "orderCode")
})
@EntityListeners(AuditingEntityListener.class) 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// payment này lưu những thanh toán thành công, hoàn tiền của momo, vnpay...
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String orderCode;

    @Column(nullable = false, length = 20)
    private String paymethod;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(length = 100)
    private String transactionId;

    @Column(length = 20)
    private Integer status; // 1 thành công, 0 hoàn tiền

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
