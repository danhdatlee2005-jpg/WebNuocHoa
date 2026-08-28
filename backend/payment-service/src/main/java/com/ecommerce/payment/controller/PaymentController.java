package com.ecommerce.payment.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.payment.dto.PaymentDtoWrapper;
import com.ecommerce.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // F37: Khởi tạo thanh toán
    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<PaymentDtoWrapper.PaymentDto>> initiatePayment(
            @Valid @RequestBody PaymentDtoWrapper.PaymentInitRequest request) {
        PaymentDtoWrapper.PaymentDto payment = paymentService.initiatePayment(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment initiated", payment));
    }

    // F38: Webhook / Callback từ cổng thanh toán (kiểm tra chữ ký)
    @PostMapping("/callback")
    public ResponseEntity<ApiResponse<PaymentDtoWrapper.PaymentDto>> handleCallback(
            @RequestBody PaymentDtoWrapper.PaymentCallbackRequest callbackRequest) {
        PaymentDtoWrapper.PaymentDto payment = paymentService.processCallback(callbackRequest);
        return ResponseEntity.ok(ApiResponse.ok("Callback processed", payment));
    }

    // Xem thông tin thanh toán theo đơn hàng
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentDtoWrapper.PaymentDto>> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentDtoWrapper.PaymentDto payment = paymentService.getPaymentByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok(payment));
    }

    // Helper tạo chữ ký giả lập cho Mock Gateway
    @GetMapping("/mock-signature")
    public ResponseEntity<ApiResponse<String>> getMockSignature(
            @RequestParam Long orderId,
            @RequestParam String amount,
            @RequestParam String status) {
        String signature = paymentService.generateSignature(orderId, amount, status);
        return ResponseEntity.ok(ApiResponse.ok(signature));
    }
}
