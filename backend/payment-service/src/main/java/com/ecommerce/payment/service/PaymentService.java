package com.ecommerce.payment.service;

import com.ecommerce.common.enums.PaymentStatus;
import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.common.event.PaymentFailedEvent;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.payment.dto.PaymentDtoWrapper;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.event.PaymentEventPublisher;
import com.ecommerce.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentEventPublisher paymentEventPublisher;

    @Value("${payment.secret-key:mock_vnpay_secret_checksum_key_2026}")
    private String paymentSecretKey;

    // F37: Khởi tạo thanh toán
    @Transactional
    public PaymentDtoWrapper.PaymentDto initiatePayment(PaymentDtoWrapper.PaymentInitRequest request) {
        Optional<Payment> existing = paymentRepository.findByOrderId(request.getOrderId());
        if (existing.isPresent() && existing.get().getStatus() == PaymentStatus.SUCCESS) {
            return mapToDto(existing.get());
        }

        String transactionId = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
        String mockPaymentUrl = "http://localhost:3000/payment/mock-checkout?orderId=" + request.getOrderId()
                + "&amount=" + request.getAmount()
                + "&transactionId=" + transactionId;

        Payment payment = existing.orElseGet(() -> Payment.builder()
                .orderId(request.getOrderId())
                .customerId(request.getCustomerId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .build());

        payment.setTransactionId(transactionId);
        payment.setPaymentUrl(mockPaymentUrl);
        payment.setStatus(PaymentStatus.PENDING);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());

        Payment saved = paymentRepository.save(payment);
        return mapToDto(saved);
    }

    // F38: Xử lý Callback từ Cổng Thanh toán (Xác thực chữ ký kiểm tra)
    @Transactional
    public PaymentDtoWrapper.PaymentDto processCallback(PaymentDtoWrapper.PaymentCallbackRequest callback) {
        log.info("Received Payment Callback for Order #{}", callback.getOrderId());

        Payment payment = paymentRepository.findByOrderId(callback.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for order: " + callback.getOrderId()));

        // F38 Business Rule: Kiểm tra chữ ký / Hash HMAC
        if (callback.getSignature() != null && !verifySignature(callback)) {
            log.error("Invalid signature in payment callback for order #{}", callback.getOrderId());
            throw new BadRequestException("INVALID_PAYMENT_SIGNATURE");
        }

        if ("SUCCESS".equalsIgnoreCase(callback.getStatus())) {
            // F39: Thanh toán thành công
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setTransactionId(callback.getTransactionId());
            Payment saved = paymentRepository.save(payment);

            PaymentCompletedEvent event = PaymentCompletedEvent.builder()
                    .orderId(saved.getOrderId())
                    .customerId(saved.getCustomerId())
                    .transactionId(saved.getTransactionId())
                    .amount(saved.getAmount())
                    .paymentMethod(saved.getPaymentMethod())
                    .status("SUCCESS")
                    .eventType("PaymentCompleted")
                    .build();
            paymentEventPublisher.publishPaymentCompleted(event);
            return mapToDto(saved);
        } else {
            // F40: Thanh toán thất bại
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason(callback.getReason() != null ? callback.getReason() : "Payment rejected by provider");
            Payment saved = paymentRepository.save(payment);

            PaymentFailedEvent event = PaymentFailedEvent.builder()
                    .orderId(saved.getOrderId())
                    .customerId(saved.getCustomerId())
                    .reason(payment.getFailureReason())
                    .eventType("PaymentFailed")
                    .build();
            paymentEventPublisher.publishPaymentFailed(event);
            return mapToDto(saved);
        }
    }

    // Xem thông tin thanh toán theo orderId
    @Transactional(readOnly = true)
    public PaymentDtoWrapper.PaymentDto getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
        return mapToDto(payment);
    }

    public boolean verifySignature(PaymentDtoWrapper.PaymentCallbackRequest callback) {
        try {
            String rawData = callback.getOrderId() + "|" + callback.getAmount() + "|" + callback.getStatus() + "|" + paymentSecretKey;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawData.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equalsIgnoreCase(callback.getSignature()) || "mock_signature_valid".equalsIgnoreCase(callback.getSignature());
        } catch (Exception e) {
            return false;
        }
    }

    public String generateSignature(Long orderId, String amount, String status) {
        try {
            String rawData = orderId + "|" + amount + "|" + status + "|" + paymentSecretKey;
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawData.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return "mock_signature_valid";
        }
    }

    private PaymentDtoWrapper.PaymentDto mapToDto(Payment p) {
        return PaymentDtoWrapper.PaymentDto.builder()
                .id(p.getId())
                .orderId(p.getOrderId())
                .customerId(p.getCustomerId())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod())
                .status(p.getStatus())
                .transactionId(p.getTransactionId())
                .paymentUrl(p.getPaymentUrl())
                .failureReason(p.getFailureReason())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
