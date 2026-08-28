package com.ecommerce.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterCriteria {
    private String keyword; // F14
    private String brand; // F15
    private String category;
    private String gender; // MEN, WOMEN, UNISEX
    private String fragranceFamily;
    private String concentration;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minRating;
    private String sortBy; // newest, priceAsc, priceDesc, ratingDesc, bestSeller, nameAsc (F16)
    private Integer page = 0;
    private Integer size = 12;
}
