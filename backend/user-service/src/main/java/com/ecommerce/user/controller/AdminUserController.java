package com.ecommerce.user.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.user.dto.UserProfileDto;
import com.ecommerce.user.dto.UserStatusRequest;
import com.ecommerce.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdminRole(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    // F57: Admin xem danh sách & tìm kiếm user
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserProfileDto>>> getUsers(
            HttpServletRequest request,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        checkAdminRole(request);
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<UserProfileDto> result = userService.getUsers(query, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    // F57: Admin xem chi tiết user
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserDetail(
            HttpServletRequest request,
            @PathVariable Long userId) {
        checkAdminRole(request);
        UserProfileDto profile = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    // F57: Admin khóa / mở khóa tài khoản
    @PatchMapping("/{userId}/status")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateUserStatus(
            HttpServletRequest request,
            @PathVariable Long userId,
            @RequestBody UserStatusRequest statusRequest) {
        checkAdminRole(request);
        UserProfileDto updated = userService.updateUserStatus(userId, statusRequest);
        return ResponseEntity.ok(ApiResponse.ok("User status updated successfully", updated));
    }
}
