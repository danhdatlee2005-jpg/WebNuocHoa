package com.ecommerce.product.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(nullable = false)
    private String variantName; // e.g. "50ml", "100ml", "200ml"

    private String volume; // "50ml", "100ml"

    @Column(nullable = false)
    private BigDecimal price;

    private BigDecimal promotionalPrice;

    @Column(nullable = false)
    private String sku;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
