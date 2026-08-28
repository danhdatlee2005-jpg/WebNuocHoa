package com.ecommerce.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    private Long variantId;

    @Column(nullable = false)
    private String productName;

    private String variantName;
    private String sku;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalQuantity = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer reservedQuantity = 0;

    @Builder.Default
    private Integer lowStockThreshold = 10;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // F33: Công thức AvailableQuantity = TotalQuantity - ReservedQuantity
    public Integer getAvailableQuantity() {
        int avail = (totalQuantity != null ? totalQuantity : 0) - (reservedQuantity != null ? reservedQuantity : 0);
        return Math.max(0, avail);
    }
}
