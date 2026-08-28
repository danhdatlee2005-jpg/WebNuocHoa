package com.ecommerce.promotion.dto;

import com.ecommerce.common.enums.DiscountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PromotionDtoWrapper {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CouponValidateRequest {
        @NotBlank(message = "Coupon code is required")
        private String couponCode;

        private Long customerId;

        @NotNull(message = "Order value is required")
        private BigDecimal orderValue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CouponValidationResult {
        private boolean valid;
        private String message;
        private String couponCode;
        private DiscountType discountType;
        private BigDecimal discountValue;
        private BigDecimal discountAmount;
        private BigDecimal finalPrice;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CouponDto {
        private Long id;
        private String code;
        private String description;
        private DiscountType discountType;
        private BigDecimal discountValue;
        private BigDecimal minimumOrder;
        private BigDecimal maximumDiscount;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Integer usageLimit;
        private Integer usedCount;
        private boolean active;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CouponCreateRequest {
        @NotBlank(message = "Coupon code is required")
        private String code;

        private String description;

        @NotNull(message = "Discount type is required")
        private DiscountType discountType;

        @NotNull(message = "Discount value is required")
        private BigDecimal discountValue;

        private BigDecimal minimumOrder;
        private BigDecimal maximumDiscount;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Integer usageLimit;
        private boolean active = true;
    }
}
