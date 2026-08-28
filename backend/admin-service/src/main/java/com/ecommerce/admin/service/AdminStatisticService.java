package com.ecommerce.admin.service;

import com.ecommerce.admin.entity.DailyStatistic;
import com.ecommerce.admin.repository.DailyStatisticRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminStatisticService {

    private final DailyStatisticRepository repository;

    @Transactional
    public void incrementOrders(LocalDate date) {
        DailyStatistic stat = repository.findByDate(date).orElse(createNew(date));
        stat.setTotalOrders(stat.getTotalOrders() + 1);
        repository.save(stat);
    }

    @Transactional
    public void addRevenue(LocalDate date, BigDecimal amount) {
        DailyStatistic stat = repository.findByDate(date).orElse(createNew(date));
        stat.setTotalRevenue(stat.getTotalRevenue().add(amount));
        repository.save(stat);
    }

    private DailyStatistic createNew(LocalDate date) {
        return DailyStatistic.builder()
                .date(date)
                .totalOrders(0)
                .totalRevenue(BigDecimal.ZERO)
                .newCustomers(0)
                .build();
    }
    
    public List<DailyStatistic> getAllStatistics() {
        return repository.findAll();
    }
}
