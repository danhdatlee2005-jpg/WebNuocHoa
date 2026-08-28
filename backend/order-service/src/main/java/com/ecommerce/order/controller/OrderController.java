package com.ecommerce.order.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.UnauthorizedException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.order.dto.CheckoutRequest;
import com.ecommerce.order.dto.OrderDto;
import com.ecommerce.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtTokenProvider jwtTokenProvider;

    private Long getUserId(HttpServletRequest request) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        return userId;
    }

    // F28, F29: Checkout tạo đơn hàng
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderDto>> checkout(
            HttpServletRequest request,
            @Valid @RequestBody CheckoutRequest checkoutRequest) {
        Long userId = getUserId(request);
        OrderDto order = orderService.checkout(userId, checkoutRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Order created successfully", order));
    }

    // F30: Lịch sử đơn hàng (My Orders)
    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getMyOrders(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long userId = getUserId(request);
        Page<OrderDto> orders = orderService.getCustomerOrders(
                userId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    // F31: Chi tiết đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderDetail(
            HttpServletRequest request,
            @PathVariable Long orderId) {
        Long userId = getUserId(request);
        OrderDto order = orderService.getOrderDetail(userId, orderId);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    // F32: Hủy đơn hàng
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(
            HttpServletRequest request,
            @PathVariable Long orderId,
            @RequestBody(required = false) Map<String, String> body) {
        Long userId = getUserId(request);
        String reason = body != null ? body.get("reason") : "Customer cancelled";
        OrderDto cancelled = orderService.cancelOrder(userId, orderId, reason);
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", cancelled));
    }

    // API nội bộ cho Review Service: Kiểm tra đã mua và nhận hàng chưa
    @GetMapping("/check-purchased")
    public ResponseEntity<ApiResponse<Boolean>> checkPurchased(
            @RequestParam Long customerId,
            @RequestParam Long productId) {
        boolean purchased = orderService.checkPurchasedAndDelivered(customerId, productId);
        return ResponseEntity.ok(ApiResponse.ok(purchased));
    }
}
