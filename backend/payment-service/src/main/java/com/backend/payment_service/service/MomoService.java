package com.backend.payment_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.backend.payment_service.client.CartServiceClient;
import com.backend.payment_service.client.OrderServiceClient;
import com.backend.payment_service.dto.request.MomoRequest;
import com.backend.payment_service.dto.request.PaymentRequest;
import com.backend.payment_service.dto.response.MomoResponse;
import com.backend.payment_service.dto.response.OrderResponse;
import com.backend.payment_service.dto.response.PaymentResponse;
import com.backend.payment_service.exception.ExternalServiceException;
import com.backend.payment_service.exception.NotFoundException;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.codec.binary.Hex;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.Mac;
import org.springframework.beans.factory.annotation.Value;

@Service
public class MomoService {
    @Value("${momo.partnercode}")
    private String partnerCode;

    @Value("${momo.accesskey}")
    private String accessKey;

    @Value("${momo.secretkey}")
    private String secretKey;

    @Value("${momo.url}")
    private String momoUrl;

    @Value("${momo.redirect-url}")
    private String redirectUrl;

    @Value("${momo.ipn-url}")
    private String ipnUrl;

    @Value("${momo.refund-url}")
    private String refundUrl;

    private final OrderServiceClient orderServiceClient;
    private final PaymentService paymentService;
    private final CartServiceClient cartServiceClient;
    private final RestTemplate restTemplate = new RestTemplate();

    public MomoService(PaymentService paymentService, OrderServiceClient orderServiceClient,
            CartServiceClient cartServiceClient) {
        this.paymentService = paymentService;
        this.orderServiceClient = orderServiceClient;
        this.cartServiceClient = cartServiceClient;
    }

    public MomoResponse createMomo(OrderResponse order) throws Exception {
        String requestId = UUID.randomUUID().toString();
        String orderCode = order.getOrderCode();
        String amount = order.getTotal().toBigInteger().toString();

        String rawSignature = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderCode +
                "&orderInfo=Payment order " + orderCode +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=captureWallet";

        String signature = HmacSHA256(rawSignature, secretKey);

        MomoRequest request = MomoRequest.builder()
                .partnerCode(partnerCode)
                .accessKey(accessKey)
                .requestId(requestId)
                .amount(amount)
                .orderId(orderCode)
                .orderInfo("Payment order " + orderCode)
                .redirectUrl(redirectUrl)
                .ipnUrl(ipnUrl)
                .extraData("")
                .requestType("captureWallet")
                .lang("en")
                .signature(signature)
                .build();

        return restTemplate.postForObject(momoUrl, request, MomoResponse.class);
    }

    public void refundMomo(
            String transId,
            BigDecimal amount,
            String orderCode) throws Exception {
        String refundOrderId = orderCode + "_REFUND_" + System.currentTimeMillis();
        String requestId = UUID.randomUUID().toString();
        String amountStr = amount.toBigInteger().toString();

        String description = "Hoàn tiền đơn hàng " + orderCode;

        String rawSignature = "accessKey=" + accessKey
                + "&amount=" + amountStr
                + "&description=" + description
                + "&orderId=" + refundOrderId
                + "&partnerCode=" + partnerCode
                + "&requestId=" + requestId
                + "&transId=" + transId;

        String signature = HmacSHA256(rawSignature, secretKey);

        Map<String, Object> requestBody = Map.of(
                "partnerCode", partnerCode,
                "accessKey", accessKey,
                "requestId", requestId,
                "orderId", refundOrderId,
                "amount", amountStr,
                "transId", transId,
                "lang", "vi",
                "description", description,
                "signature", signature);

        Map<String, Object> response = restTemplate.postForObject(refundUrl, requestBody, Map.class);

        if (!"0".equals(String.valueOf(response.get("resultCode")))) {
            throw new ExternalServiceException("Hoàn tiền Momo thất bại: " + response);
        }
    }

    @Transactional
    public void refundByOrderCode(String orderCode) throws Exception {

        PaymentResponse payment = paymentService.getPaymentByOrderCode(orderCode);

        refundMomo(
                payment.getTransactionId(),
                payment.getAmount(),
                payment.getOrderCode());

        // cập nhật status thành 0 là hoàn tiền
        paymentService.updatePaymentStatus(orderCode, 0);
    }

    @Transactional
    public boolean handleSuccessfulPayment(Map<String, Object> payload) throws Exception {

        String orderCode = (String) payload.get("orderId");
        String transId = String.valueOf(payload.get("transId"));

        OrderResponse order = orderServiceClient.getOrderByOrderCodeInternal(orderCode);

        if (order == null) {
            throw new NotFoundException("Đơn hàng không tìm thấy");
        }

        if (order.getStatus() != -1) {
            return true;
        }

        try {
            orderServiceClient.confirmGatewayPaymentInternal(orderCode);

            PaymentRequest paymentRequest = PaymentRequest.builder()
                    .orderId(order.getId())
                    .orderCode(order.getOrderCode())
                    .paymethod("momo")
                    .amount(order.getTotal())
                    .transactionId(transId)
                    .status(1)
                    .build();

            paymentService.createPayment(paymentRequest);

            cartServiceClient.clearCartInternal(order.getUserId());

            return true;

        } catch (Exception e) {

            refundMomo(
                    transId,
                    order.getTotal(),
                    order.getOrderCode());

            orderServiceClient.deleteOrderByCodeInternal(orderCode);

            return false;
        }
    }

    private String HmacSHA256(String data, String key) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Hex.encodeHexString(hash);
    }

    public boolean validateSignature(Map<String, Object> payload) throws Exception {
        String orderId = (String) payload.get("orderId");
        String resultCode = String.valueOf(payload.get("resultCode"));
        String transId = String.valueOf(payload.get("transId"));

        String rawSignature = "partnerCode="
                + partnerCode
                + "&accessKey="
                + accessKey
                + "&requestId="
                + payload.get("requestId")
                + "&amount="
                + payload.get("amount")
                + "&orderId="
                + orderId
                + "&orderInfo="
                + payload.get("orderInfo")
                + "&orderType="
                + payload.get("orderType")
                + "&transId="
                + transId
                + "&resultCode="
                + resultCode
                + "&message="
                + payload.get("message")
                + "&responseTime="
                + payload.get("responseTime")
                + "&extraData="
                + payload.get("extraData");

        String checkSignature = HmacSHA256(rawSignature, secretKey);
        String signature = (String) payload.get("signature");

        return checkSignature.equals(signature);
    }
}
