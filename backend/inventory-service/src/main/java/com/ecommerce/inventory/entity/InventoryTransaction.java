package com.ecommerce.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    private Long variantId;

    @Column(nullable = false)
    private String transactionType; // RESTOCK, RESERVE, RELEASE, ADJUSTMENT, FULFILL

    @Column(nullable = false)
    private Integer quantity;

    private String supplier;
    private Long orderId;
    private String reason;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
