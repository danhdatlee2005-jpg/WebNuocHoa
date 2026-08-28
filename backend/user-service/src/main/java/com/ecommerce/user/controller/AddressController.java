package com.ecommerce.user.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.UnauthorizedException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.user.dto.AddressDto;
import com.ecommerce.user.dto.AddressRequest;
import com.ecommerce.user.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final JwtTokenProvider jwtTokenProvider;

    // Xem danh sách địa chỉ của user
    @GetMapping
    public ResponseEntity<ApiResponse<List<AddressDto>>> getAddresses(HttpServletRequest request) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        List<AddressDto> addresses = addressService.getAddresses(userId);
        return ResponseEntity.ok(ApiResponse.ok(addresses));
    }

    // F08: Thêm địa chỉ
    @PostMapping
    public ResponseEntity<ApiResponse<AddressDto>> addAddress(
            HttpServletRequest request,
            @Valid @RequestBody AddressRequest addressRequest) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        AddressDto created = addressService.addAddress(userId, addressRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Address added successfully", created));
    }

    // F09: Cập nhật địa chỉ
    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressDto>> updateAddress(
            HttpServletRequest request,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest addressRequest) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        AddressDto updated = addressService.updateAddress(userId, addressId, addressRequest);
        return ResponseEntity.ok(ApiResponse.ok("Address updated successfully", updated));
    }

    // F10: Xóa địa chỉ
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            HttpServletRequest request,
            @PathVariable Long addressId) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.ok(ApiResponse.ok("Address deleted successfully", null));
    }

    // F11: Đặt địa chỉ mặc định
    @PatchMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<AddressDto>> setDefaultAddress(
            HttpServletRequest request,
            @PathVariable Long addressId) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        AddressDto updated = addressService.setDefaultAddress(userId, addressId);
        return ResponseEntity.ok(ApiResponse.ok("Default address updated", updated));
    }
}
