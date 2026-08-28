package com.ecommerce.product.dto;

import com.ecommerce.common.enums.ProductStatus;
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
public class ProductUpdateRequest {
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
    private ProductStatus status;
    private List<ProductCreateRequest.VariantCreateDto> variants;
}
