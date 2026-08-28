package com.ecommerce.inventory.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.inventory.dto.InventoryDtoWrapper;
import com.ecommerce.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // Public / Customer xem tồn kho cơ bản
    @GetMapping("/public/status")
    public ResponseEntity<ApiResponse<List<InventoryDtoWrapper.InventoryDto>>> getPublicStock() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.getAllInventory()));
    }
}
