package com.ecommerce.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class InventoryDtoWrapper {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryDto {
        private Long id;
        private Long productId;
        private Long variantId;
        private String productName;
        private String variantName;
        private String sku;
        private Integer totalQuantity;
        private Integer reservedQuantity;
        private Integer availableQuantity;
        private Integer lowStockThreshold;
        private boolean isLowStock;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RestockRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        private Long variantId;
        private String productName;
        private String variantName;
        private String sku;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        private String supplier;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdjustStockRequest {
        @NotNull(message = "New total quantity is required")
        @Min(value = 0, message = "Quantity cannot be negative")
        private Integer newTotalQuantity;

        private String reason;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionDto {
        private Long id;
        private Long productId;
        private Long variantId;
        private String transactionType;
        private Integer quantity;
        private String supplier;
        private Long orderId;
        private String reason;
        private LocalDateTime createdAt;
    }
}
