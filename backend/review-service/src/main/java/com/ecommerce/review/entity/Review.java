package com.ecommerce.review.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long productId;
    private Long userId;
    private Long orderId; // To verify the review is from a completed order
    
    @Column(nullable = false)
    private Integer rating; // 1 to 5
    
    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private boolean approved = false;
    
    private LocalDateTime createdAt;
}
