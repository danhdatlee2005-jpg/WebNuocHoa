package com.ecommerce.payment.dto;

import com.ecommerce.common.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDtoWrapper {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentInitRequest {
        @NotNull(message = "Order ID is required")
        private Long orderId;

        @NotNull(message = "Customer ID is required")
        private Long customerId;

        @NotNull(message = "Amount is required")
        private BigDecimal amount;

        @NotNull(message = "Payment method is required")
        private String paymentMethod;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDto {
        private Long id;
        private Long orderId;
        private Long customerId;
        private BigDecimal amount;
        private String paymentMethod;
        private PaymentStatus status;
        private String transactionId;
        private String paymentUrl;
        private String failureReason;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentCallbackRequest {
        private Long orderId;
        private String transactionId;
        private BigDecimal amount;
        private String status; // SUCCESS, FAILED
        private String signature; // HMAC Checksum
        private String reason;
    }
}
