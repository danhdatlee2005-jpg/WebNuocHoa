package com.ecommerce.product.entity;

import com.ecommerce.common.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String category;

    @Column(length = 2000)
    private String description;

    private String gender; // MEN, WOMEN, UNISEX
    private String concentration; // EDT, EDP, Parfum, Cologne
    private String fragranceFamily; // Floral, Woody, Oriental, Fresh, Citrus
    private String topNotes;
    private String middleNotes;
    private String baseNotes;

    @Column(nullable = false)
    private BigDecimal basePrice;

    private BigDecimal promotionalPrice;

    @Column(length = 1000)
    private String imageUrl; // Primary image

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    @org.hibernate.annotations.BatchSize(size = 20)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Builder.Default
    private Double rating = 5.0;

    @Builder.Default
    private Integer totalReviews = 0;

    @Builder.Default
    private Integer soldCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @org.hibernate.annotations.BatchSize(size = 20)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public void addVariant(ProductVariant variant) {
        variants.add(variant);
        variant.setProduct(this);
    }
}
