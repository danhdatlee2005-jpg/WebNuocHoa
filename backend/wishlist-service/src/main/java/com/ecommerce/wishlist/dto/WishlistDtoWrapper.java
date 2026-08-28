package com.ecommerce.wishlist.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WishlistDtoWrapper {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WishlistItemDto {
        private Long id;
        private Long userId;
        private Long productId;
        private String productName;
        private String brand;
        private String imageUrl;
        private BigDecimal price;
        private Double rating;
        private boolean inStock;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddToWishlistRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotBlank(message = "Product name is required")
        private String productName;

        private String brand;
        private String imageUrl;
        private BigDecimal price;
        private Double rating;
        private boolean inStock = true;
    }
}
