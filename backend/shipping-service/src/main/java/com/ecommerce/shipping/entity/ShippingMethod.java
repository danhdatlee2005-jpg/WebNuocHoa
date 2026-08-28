package com.ecommerce.shipping.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "shipping_methods")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ShippingMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name; // Standard, Express, Next Day
    private String carrier; // VNPost, GHN, GHTK
    private BigDecimal baseFee;
    private Integer estimatedDays;
    private Boolean active;
}
