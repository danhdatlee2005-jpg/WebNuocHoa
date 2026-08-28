package com.ecommerce.inventory.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.inventory.dto.InventoryDtoWrapper;
import com.ecommerce.inventory.service.InventoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
public class AdminInventoryController {

    private final InventoryService inventoryService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdmin(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    // F33, F59: Admin xem toàn bộ tồn kho
    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryDtoWrapper.InventoryDto>>> getAllStock(HttpServletRequest request) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.getAllInventory()));
    }

    // F59: Xem sản phẩm sắp hết hàng
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryDtoWrapper.InventoryDto>>> getLowStock(HttpServletRequest request) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.getLowStockItems()));
    }

    // F34, F59: Admin nhập kho (Restock / Inward)
    @PostMapping("/restock")
    public ResponseEntity<ApiResponse<InventoryDtoWrapper.InventoryDto>> restock(
            HttpServletRequest request,
            @Valid @RequestBody InventoryDtoWrapper.RestockRequest restockRequest) {
        checkAdmin(request);
        InventoryDtoWrapper.InventoryDto item = inventoryService.restock(restockRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Stock added successfully", item));
    }

    // F59: Điều chỉnh tồn kho
    @PutMapping("/{inventoryId}/adjust")
    public ResponseEntity<ApiResponse<InventoryDtoWrapper.InventoryDto>> adjustStock(
            HttpServletRequest request,
            @PathVariable Long inventoryId,
            @Valid @RequestBody InventoryDtoWrapper.AdjustStockRequest adjustRequest) {
        checkAdmin(request);
        InventoryDtoWrapper.InventoryDto item = inventoryService.adjustStock(inventoryId, adjustRequest);
        return ResponseEntity.ok(ApiResponse.ok("Stock adjusted successfully", item));
    }

    // F59: Xem lịch sử nhập/xuất kho
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<InventoryDtoWrapper.TransactionDto>>> getTransactions(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        checkAdmin(request);
        Page<InventoryDtoWrapper.TransactionDto> result = inventoryService.getTransactions(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
