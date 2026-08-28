package com.ecommerce.user.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.UnauthorizedException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.user.dto.UpdateProfileRequest;
import com.ecommerce.user.dto.UserProfileDto;
import com.ecommerce.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    // F06: Xem hồ sơ cá nhân
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(HttpServletRequest request) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        UserProfileDto profile = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    // F07: Cập nhật hồ sơ
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            HttpServletRequest request,
            @Valid @RequestBody UpdateProfileRequest updateRequest) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        UserProfileDto updated = userService.updateProfile(userId, updateRequest);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
