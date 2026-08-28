package com.ecommerce.product.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.product.dto.CategoryDtoWrapper;
import com.ecommerce.product.service.CategoryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdmin(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    // Public xem danh mục
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDtoWrapper.CategoryDto>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getAllCategories(true)));
    }

    // Admin xem toàn bộ
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<CategoryDtoWrapper.CategoryDto>>> getAllCategoriesAdmin(HttpServletRequest request) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getAllCategories(false)));
    }

    // F62: Admin thêm Category
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDtoWrapper.CategoryDto>> createCategory(
            HttpServletRequest request,
            @Valid @RequestBody CategoryDtoWrapper.CategoryRequest categoryRequest) {
        checkAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Category created", categoryService.createCategory(categoryRequest)));
    }

    // F62: Admin sửa Category
    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<CategoryDtoWrapper.CategoryDto>> updateCategory(
            HttpServletRequest request,
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDtoWrapper.CategoryRequest categoryRequest) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok("Category updated", categoryService.updateCategory(categoryId, categoryRequest)));
    }

    // F62: Admin xóa/ẩn Category
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            HttpServletRequest request,
            @PathVariable Long categoryId) {
        checkAdmin(request);
        categoryService.deleteOrHideCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.ok("Category deactivated", null));
    }
}
