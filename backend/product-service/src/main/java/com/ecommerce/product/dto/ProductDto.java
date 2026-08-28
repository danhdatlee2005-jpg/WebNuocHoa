package com.ecommerce.product.dto;

import com.ecommerce.common.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String brand;
    private String category;
    private String description;
    private String gender;
    private String concentration;
    private String fragranceFamily;
    private String topNotes;
    private String middleNotes;
    private String baseNotes;
    private BigDecimal basePrice;
    private BigDecimal promotionalPrice;
    private String imageUrl;
    private List<String> images;
    private Double rating;
    private Integer totalReviews;
    private Integer soldCount;
    private ProductStatus status;
    private List<ProductVariantDto> variants;
    private LocalDateTime createdAt;
}
