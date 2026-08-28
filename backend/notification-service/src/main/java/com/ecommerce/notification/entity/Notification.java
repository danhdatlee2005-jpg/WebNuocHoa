package com.ecommerce.notification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId; // Recipient
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    private Boolean isRead;
    
    private String type; // ORDER, PROMOTION, SYSTEM
    
    private LocalDateTime createdAt;
}
