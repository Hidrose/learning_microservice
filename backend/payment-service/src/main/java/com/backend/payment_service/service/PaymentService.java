package com.backend.payment_service.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.payment_service.dto.request.PaymentRequest;
import com.backend.payment_service.dto.response.PaymentResponse;
import com.backend.payment_service.entity.Payment;
import com.backend.payment_service.exception.AppException;
import com.backend.payment_service.exception.ErrorCode;
import com.backend.payment_service.mapper.PaymentMapper;
import com.backend.payment_service.repository.PaymentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Page<PaymentResponse> getAllPayments(
            int page,
            int limit,
            String q,
            Integer status) {

        Pageable pageable = PageRequest.of(
                page - 1,
                limit,
                Sort.by("createdAt").descending());

        Page<Payment> paymentPage;

        boolean hasQ = q != null && !q.isBlank();
        boolean hasStatus = status != null;

        if (hasQ && hasStatus) {
            paymentPage = paymentRepository
                    .findByOrderCodeContainingIgnoreCaseAndStatus(
                            q,
                            status,
                            pageable);
        } else if (hasQ) {
            paymentPage = paymentRepository
                    .findByOrderCodeContainingIgnoreCase(
                            q,
                            pageable);
        } else if (hasStatus) {
            paymentPage = paymentRepository
                    .findByStatus(
                            status,
                            pageable);
        } else {
            paymentPage = paymentRepository.findAll(pageable);
        }

        return paymentPage.map(PaymentMapper::toResponse);
    }

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {

        Payment payment = PaymentMapper.toEntity(request);

        Payment savedPayment = paymentRepository.save(payment);

        return PaymentMapper.toResponse(savedPayment);
    }

    @Transactional
    public void updatePaymentStatus(
            String orderCode,
            Integer status) {

        Payment payment = paymentRepository
                .findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_ORDER_NOT_FOUND));

        payment.setStatus(status);

        paymentRepository.save(payment);
    }

    public PaymentResponse getPaymentByOrderCode(String orderCode) {

        Payment payment = paymentRepository
                .findByOrderCode(orderCode)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        return PaymentMapper.toResponse(payment);
    }

}
