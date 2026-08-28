package com.ecommerce.admin.controller;

import com.ecommerce.admin.entity.DailyStatistic;
import com.ecommerce.admin.service.AdminStatisticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AdminStatisticService statisticService;

    @GetMapping("/statistics")
    public ResponseEntity<List<DailyStatistic>> getStatistics() {
        return ResponseEntity.ok(statisticService.getAllStatistics());
    }
}
