package com.ecommerce.order.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.enums.OrderStatus;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.order.dto.OrderDto;
import com.ecommerce.order.dto.OrderStatusUpdateRequest;
import com.ecommerce.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdmin(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    // F58: Admin xem danh sách đơn hàng
    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getOrders(
            HttpServletRequest request,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        checkAdmin(request);
        Page<OrderDto> orders = orderService.getAllOrdersAdmin(
                status, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    // F58: Admin xem chi tiết đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderDetail(
            HttpServletRequest request,
            @PathVariable Long orderId) {
        checkAdmin(request);
        // Using customerId 0 to bypass or getting directly
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrderDetail(null, orderId)));
    }

    // F58: Admin cập nhật trạng thái đơn (Confirm, Processing, Cancel, Ship, Complete)
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            HttpServletRequest request,
            @PathVariable Long orderId,
            @RequestBody OrderStatusUpdateRequest statusRequest) {
        checkAdmin(request);
        OrderDto updated = orderService.updateOrderStatusAdmin(orderId, statusRequest);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
    }
}
