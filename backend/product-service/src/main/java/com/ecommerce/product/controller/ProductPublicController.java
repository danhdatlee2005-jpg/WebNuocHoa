package com.ecommerce.product.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.product.dto.ProductDto;
import com.ecommerce.product.dto.ProductFilterCriteria;
import com.ecommerce.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductPublicController {

    private final ProductService productService;

    // F12, F14, F15, F16: Xem danh sách, tìm kiếm, lọc, sắp xếp cho khách hàng
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String fragranceFamily,
            @RequestParam(required = false) String concentration,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        ProductFilterCriteria criteria = ProductFilterCriteria.builder()
                .keyword(keyword)
                .brand(brand)
                .category(category)
                .gender(gender)
                .fragranceFamily(fragranceFamily)
                .concentration(concentration)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .minRating(minRating)
                .sortBy(sortBy)
                .page(page)
                .size(size)
                .build();

        Page<ProductDto> products = productService.getProductsCustomer(criteria);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    // F13: Xem chi tiết sản phẩm
    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductDetail(@PathVariable Long productId) {
        ProductDto product = productService.getProductDetail(productId);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }
}
