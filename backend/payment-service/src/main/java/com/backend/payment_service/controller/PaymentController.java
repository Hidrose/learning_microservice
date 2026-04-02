package com.backend.payment_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import com.backend.payment_service.client.OrderServiceClient;
import com.backend.payment_service.dto.request.PaymentRequest;
import com.backend.payment_service.dto.response.ApiResponse;
import com.backend.payment_service.dto.response.MomoResponse;
import com.backend.payment_service.dto.response.OrderResponse;
import com.backend.payment_service.dto.response.PaymentResponse;
import com.backend.payment_service.service.MomoService;
import com.backend.payment_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;

@Validated
@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Value("${frontend.url}")
    private String frontendUrl;

    private final MomoService momoService;
    private final OrderServiceClient orderServiceClient;
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService, MomoService momoService,
            OrderServiceClient orderServiceClient) {
        this.paymentService = paymentService;
        this.momoService = momoService;
        this.orderServiceClient = orderServiceClient;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer status) {

        Page<PaymentResponse> paymentPage = paymentService.getAllPayments(page, limit, q, status);

        return ResponseEntity.ok(
                ApiResponse.<List<PaymentResponse>>builder()
                        .message("Lấy danh sách thanh toán thành công")
                        .data(paymentPage.getContent())
                        .totalPages(paymentPage.getTotalPages())
                        .total(paymentPage.getTotalElements())
                        .build());
    }

    // Momo
    @PostMapping("/momo/{orderCode}")
    public ResponseEntity<ApiResponse<MomoResponse>> createMomo(
            @PathVariable String orderCode) throws Exception {

        OrderResponse order = orderServiceClient.getOrderByOrderCodeInternal(orderCode);

        MomoResponse momoResponse = momoService.createMomo(order);

        return ResponseEntity.ok(
                ApiResponse.<MomoResponse>builder()
                        .message("Tạo thanh toán Momo thành công")
                        .data(momoResponse)
                        .build());
    }

    @GetMapping("/momo/redirect")
    public ResponseEntity<Void> handleRedirectInternal(
            @RequestParam(required = false) String resultCode,
            @RequestParam(required = false) String orderId,
            @RequestParam(required = false) String transId,
            @RequestParam(required = false) String message)
            throws Exception {
        String redirectUrl;

        if ("0".equals(resultCode)) {
            Map<String, Object> payload = new HashMap<>();
            payload.put("orderId", orderId);
            payload.put("resultCode", resultCode);
            payload.put("transId", transId != null ? transId : "");
            payload.put("message", message != null ? message : "");

            boolean success = momoService.handleSuccessfulPayment(payload);

            if (success) {
                redirectUrl = frontendUrl + "/order-result?result=successful";
            } else {
                redirectUrl = frontendUrl + "/order-result?result=fail";
            }
        } else {
            redirectUrl = frontendUrl + "/";
        }

        return ResponseEntity.status(302).header("Location", redirectUrl).build();
    }

    // internal
    @PostMapping("/internal")
    public ResponseEntity<PaymentResponse> createPaymentInternal(
            @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.createPayment(request));
    }

    @PostMapping("/internal/momo/refund/{orderCode}")
    public ResponseEntity<Void> refundMomoByOrderCodeInternal(
            @PathVariable String orderCode) throws Exception {

        momoService.refundByOrderCode(orderCode);

        return ResponseEntity.noContent().build();
    }
}
