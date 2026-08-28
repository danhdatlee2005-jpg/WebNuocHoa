package com.ecommerce.order.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private String customerEmail;
    private String customerName;
    private String customerPhone;

    @NotNull(message = "Shipping address is required")
    private String shippingAddress;

    private String shippingMethod; // STANDARD, EXPRESS
    private String promotionCode;
    private String paymentMethod; // COD, VNPAY, MOMO, BANKING
    private String notes;

    private BigDecimal shippingFee;
    private BigDecimal discountAmount;

    @NotEmpty(message = "Order must have at least one item")
    private List<CheckoutItemDto> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckoutItemDto {
        @NotNull(message = "Product ID is required")
        private Long productId;
        private Long variantId;
        private String productName;
        private String variantName;
        private String imageUrl;
        @NotNull(message = "Unit price is required")
        private BigDecimal unitPrice;
        @NotNull(message = "Quantity is required")
        private Integer quantity;
    }
}
