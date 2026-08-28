package com.ecommerce.wishlist.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.UnauthorizedException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.wishlist.dto.WishlistDtoWrapper;
import com.ecommerce.wishlist.service.WishlistService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final JwtTokenProvider jwtTokenProvider;

    private Long getUserId(HttpServletRequest request) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        return userId;
    }

    // F27: Xem Wishlist
    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistDtoWrapper.WishlistItemDto>>> getWishlist(HttpServletRequest request) {
        Long userId = getUserId(request);
        List<WishlistDtoWrapper.WishlistItemDto> items = wishlistService.getWishlist(userId);
        return ResponseEntity.ok(ApiResponse.ok(items));
    }

    // F25: Thêm vào Wishlist
    @PostMapping
    public ResponseEntity<ApiResponse<WishlistDtoWrapper.WishlistItemDto>> addToWishlist(
            HttpServletRequest request,
            @Valid @RequestBody WishlistDtoWrapper.AddToWishlistRequest addRequest) {
        Long userId = getUserId(request);
        WishlistDtoWrapper.WishlistItemDto item = wishlistService.addToWishlist(userId, addRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Added to wishlist", item));
    }

    // F26: Xóa khỏi Wishlist
    @DeleteMapping("/{wishlistItemId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            HttpServletRequest request,
            @PathVariable Long wishlistItemId) {
        Long userId = getUserId(request);
        wishlistService.removeFromWishlist(userId, wishlistItemId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", null));
    }

    // Kiểm tra sản phẩm đã thích chưa
    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlist(
            HttpServletRequest request,
            @PathVariable Long productId) {
        Long userId = getUserId(request);
        boolean isLiked = wishlistService.checkInWishlist(userId, productId);
        return ResponseEntity.ok(ApiResponse.ok(isLiked));
    }
}
