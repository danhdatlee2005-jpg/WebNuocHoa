package com.ecommerce.promotion.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.promotion.dto.PromotionDtoWrapper;
import com.ecommerce.promotion.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    // F41, F42: Khách hàng kiểm tra và áp dụng mã giảm giá
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<PromotionDtoWrapper.CouponValidationResult>> validateCoupon(
            @Valid @RequestBody PromotionDtoWrapper.CouponValidateRequest request) {
        PromotionDtoWrapper.CouponValidationResult result = promotionService.validateCoupon(request);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
