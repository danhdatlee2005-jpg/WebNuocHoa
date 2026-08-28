package com.ecommerce.product.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.product.dto.BrandDtoWrapper;
import com.ecommerce.product.service.BrandService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdmin(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    // Public xem danh sách brands
    @GetMapping
    public ResponseEntity<ApiResponse<List<BrandDtoWrapper.BrandDto>>> getBrands() {
        return ResponseEntity.ok(ApiResponse.ok(brandService.getAllBrands(true)));
    }

    // Admin xem tất cả (kể cả inactive)
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<BrandDtoWrapper.BrandDto>>> getAllBrandsAdmin(HttpServletRequest request) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok(brandService.getAllBrands(false)));
    }

    // F61: Admin thêm Brand
    @PostMapping
    public ResponseEntity<ApiResponse<BrandDtoWrapper.BrandDto>> createBrand(
            HttpServletRequest request,
            @Valid @RequestBody BrandDtoWrapper.BrandRequest brandRequest) {
        checkAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Brand created", brandService.createBrand(brandRequest)));
    }

    // F61: Admin sửa Brand
    @PutMapping("/{brandId}")
    public ResponseEntity<ApiResponse<BrandDtoWrapper.BrandDto>> updateBrand(
            HttpServletRequest request,
            @PathVariable Long brandId,
            @Valid @RequestBody BrandDtoWrapper.BrandRequest brandRequest) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok("Brand updated", brandService.updateBrand(brandId, brandRequest)));
    }

    // F61: Admin ẩn/hiện Brand
    @PatchMapping("/{brandId}/toggle")
    public ResponseEntity<ApiResponse<BrandDtoWrapper.BrandDto>> toggleBrand(
            HttpServletRequest request,
            @PathVariable Long brandId) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok("Brand status toggled", brandService.toggleBrandStatus(brandId)));
    }
}
