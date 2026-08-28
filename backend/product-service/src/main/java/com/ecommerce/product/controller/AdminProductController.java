package com.ecommerce.product.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.enums.ProductStatus;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.product.dto.ProductCreateRequest;
import com.ecommerce.product.dto.ProductDto;
import com.ecommerce.product.dto.ProductFilterCriteria;
import com.ecommerce.product.dto.ProductUpdateRequest;
import com.ecommerce.product.service.ProductService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdmin(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    // F60: Admin xem danh sách toàn bộ sản phẩm
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getAllProducts(
            HttpServletRequest request,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        checkAdmin(request);
        ProductFilterCriteria criteria = ProductFilterCriteria.builder()
                .keyword(keyword)
                .brand(brand)
                .category(category)
                .sortBy(sortBy)
                .page(page)
                .size(size)
                .build();
        Page<ProductDto> result = productService.getProductsAdmin(criteria);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    // F17, F60: Admin thêm sản phẩm
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(
            HttpServletRequest request,
            @Valid @RequestBody ProductCreateRequest createRequest) {
        checkAdmin(request);
        ProductDto created = productService.createProduct(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Product created successfully", created));
    }

    // F18, F60: Admin cập nhật sản phẩm
    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            HttpServletRequest request,
            @PathVariable Long productId,
            @RequestBody ProductUpdateRequest updateRequest) {
        checkAdmin(request);
        ProductDto updated = productService.updateProduct(productId, updateRequest);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", updated));
    }

    // F19, F60: Admin ẩn / kích hoạt / ngưng sản phẩm
    @PatchMapping("/{productId}/status")
    public ResponseEntity<ApiResponse<ProductDto>> updateStatus(
            HttpServletRequest request,
            @PathVariable Long productId,
            @RequestParam ProductStatus status) {
        checkAdmin(request);
        ProductDto updated = productService.updateProductStatus(productId, status);
        return ResponseEntity.ok(ApiResponse.ok("Product status updated", updated));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            HttpServletRequest request,
            @PathVariable Long productId) {
        checkAdmin(request);
        productService.deleteProduct(productId);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }
}
