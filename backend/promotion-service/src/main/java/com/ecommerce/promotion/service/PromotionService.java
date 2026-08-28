package com.ecommerce.promotion.service;

import com.ecommerce.common.enums.DiscountType;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.promotion.dto.PromotionDtoWrapper;
import com.ecommerce.promotion.entity.Coupon;
import com.ecommerce.promotion.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionService {

    private final CouponRepository couponRepository;

    // F41, F42: Kiểm tra & Áp dụng mã giảm giá
    @Transactional(readOnly = true)
    public PromotionDtoWrapper.CouponValidationResult validateCoupon(PromotionDtoWrapper.CouponValidateRequest request) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCouponCode().trim())
                .orElse(null);

        if (coupon == null || !coupon.isValid()) {
            return PromotionDtoWrapper.CouponValidationResult.builder()
                    .valid(false)
                    .message("Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng")
                    .couponCode(request.getCouponCode())
                    .discountAmount(BigDecimal.ZERO)
                    .finalPrice(request.getOrderValue())
                    .build();
        }

        if (coupon.getMinimumOrder() != null && request.getOrderValue().compareTo(coupon.getMinimumOrder()) < 0) {
            return PromotionDtoWrapper.CouponValidationResult.builder()
                    .valid(false)
                    .message("Đơn hàng chưa đạt giá trị tối thiểu " + coupon.getMinimumOrder() + " đ")
                    .couponCode(request.getCouponCode())
                    .discountAmount(BigDecimal.ZERO)
                    .finalPrice(request.getOrderValue())
                    .build();
        }

        // F42: Tính toán giảm giá
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = request.getOrderValue()
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

            if (coupon.getMaximumDiscount() != null && discountAmount.compareTo(coupon.getMaximumDiscount()) > 0) {
                discountAmount = coupon.getMaximumDiscount();
            }
        } else {
            discountAmount = coupon.getDiscountValue();
        }

        if (discountAmount.compareTo(request.getOrderValue()) > 0) {
            discountAmount = request.getOrderValue();
        }

        BigDecimal finalPrice = request.getOrderValue().subtract(discountAmount);

        return PromotionDtoWrapper.CouponValidationResult.builder()
                .valid(true)
                .message("Áp dụng mã giảm giá thành công")
                .couponCode(coupon.getCode())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .discountAmount(discountAmount)
                .finalPrice(finalPrice)
                .build();
    }

    // F43: Admin tạo coupon
    @Transactional
    public PromotionDtoWrapper.CouponDto createCoupon(PromotionDtoWrapper.CouponCreateRequest request) {
        if (couponRepository.existsByCodeIgnoreCase(request.getCode().trim())) {
            throw new BadRequestException("Coupon code already exists");
        }

        Coupon coupon = Coupon.builder()
                .code(request.getCode().trim().toUpperCase())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minimumOrder(request.getMinimumOrder())
                .maximumDiscount(request.getMaximumDiscount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit() != null ? request.getUsageLimit() : 1000)
                .usedCount(0)
                .active(request.isActive())
                .build();

        return mapToDto(couponRepository.save(coupon));
    }

    // F63: Admin xem toàn bộ coupon
    @Transactional(readOnly = true)
    public List<PromotionDtoWrapper.CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    // F63: Admin kích hoạt / vô hiệu hóa
    @Transactional
    public PromotionDtoWrapper.CouponDto toggleCouponStatus(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        coupon.setActive(!coupon.isActive());
        return mapToDto(couponRepository.save(coupon));
    }

    // Tăng số lần sử dụng khi đặt hàng thành công
    @Transactional
    public void incrementUsage(String couponCode) {
        couponRepository.findByCodeIgnoreCase(couponCode).ifPresent(coupon -> {
            coupon.setUsedCount((coupon.getUsedCount() != null ? coupon.getUsedCount() : 0) + 1);
            couponRepository.save(coupon);
        });
    }

    private PromotionDtoWrapper.CouponDto mapToDto(Coupon c) {
        return PromotionDtoWrapper.CouponDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .description(c.getDescription())
                .discountType(c.getDiscountType())
                .discountValue(c.getDiscountValue())
                .minimumOrder(c.getMinimumOrder())
                .maximumDiscount(c.getMaximumDiscount())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .usageLimit(c.getUsageLimit())
                .usedCount(c.getUsedCount())
                .active(c.isActive())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
