package com.ecommerce.product.dto;

import jakarta.validation.constraints.NotBlank;
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
public class ProductCreateRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;
    private String gender; // MEN, WOMEN, UNISEX
    private String concentration; // EDT, EDP, Parfum
    private String fragranceFamily;
    private String topNotes;
    private String middleNotes;
    private String baseNotes;

    @NotNull(message = "Base price is required")
    private BigDecimal basePrice;

    private BigDecimal promotionalPrice;
    private String imageUrl;
    private List<String> images;

    private List<VariantCreateDto> variants;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VariantCreateDto {
        private String variantName;
        private String volume;
        private BigDecimal price;
        private BigDecimal promotionalPrice;
        private String sku;
    }
}
