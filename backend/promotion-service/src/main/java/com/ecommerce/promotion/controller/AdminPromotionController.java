package com.ecommerce.promotion.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.promotion.dto.PromotionDtoWrapper;
import com.ecommerce.promotion.service.PromotionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/promotions")
@RequiredArgsConstructor
public class AdminPromotionController {

    private final PromotionService promotionService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdmin(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    // F63: Admin xem danh sách toàn bộ coupon
    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionDtoWrapper.CouponDto>>> getAllCoupons(HttpServletRequest request) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok(promotionService.getAllCoupons()));
    }

    // F43, F63: Admin tạo mới coupon
    @PostMapping
    public ResponseEntity<ApiResponse<PromotionDtoWrapper.CouponDto>> createCoupon(
            HttpServletRequest request,
            @Valid @RequestBody PromotionDtoWrapper.CouponCreateRequest createRequest) {
        checkAdmin(request);
        PromotionDtoWrapper.CouponDto coupon = promotionService.createCoupon(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Coupon created successfully", coupon));
    }

    // F63: Admin bật / tắt coupon
    @PatchMapping("/{couponId}/toggle")
    public ResponseEntity<ApiResponse<PromotionDtoWrapper.CouponDto>> toggleCoupon(
            HttpServletRequest request,
            @PathVariable Long couponId) {
        checkAdmin(request);
        PromotionDtoWrapper.CouponDto coupon = promotionService.toggleCouponStatus(couponId);
        return ResponseEntity.ok(ApiResponse.ok("Coupon status toggled", coupon));
    }
}
