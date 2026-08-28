package com.ecommerce.shipping.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Shipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long orderId;
    private Long shippingMethodId;
    
    @Column(unique = true)
    private String trackingNumber;
    
    private String carrier;
    
    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;
    
    private LocalDateTime shippedDate;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime actualDeliveryDate;
    
    @Column(columnDefinition = "TEXT")
    private String shippingAddress;
}
