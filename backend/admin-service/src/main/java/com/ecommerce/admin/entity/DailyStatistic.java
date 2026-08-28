package com.ecommerce.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "daily_statistics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DailyStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private LocalDate date;
    
    private Integer totalOrders;
    
    private BigDecimal totalRevenue;
    
    private Integer newCustomers;
}
