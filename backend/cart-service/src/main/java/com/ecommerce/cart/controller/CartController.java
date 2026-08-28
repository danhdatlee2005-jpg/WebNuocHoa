package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.dto.CartDto;
import com.ecommerce.cart.dto.UpdateCartItemRequest;
import com.ecommerce.cart.service.CartService;
import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.UnauthorizedException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final JwtTokenProvider jwtTokenProvider;

    private Long getUserId(HttpServletRequest request) {
        Long userId = SecurityContextUtil.getUserId(request, jwtTokenProvider);
        if (userId == null) {
            throw new UnauthorizedException("Unauthorized access");
        }
        return userId;
    }

    // F21: Xem giỏ hàng
    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(HttpServletRequest request) {
        Long userId = getUserId(request);
        CartDto cart = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    // F20: Thêm sản phẩm vào giỏ
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            HttpServletRequest request,
            @Valid @RequestBody AddToCartRequest addRequest) {
        Long userId = getUserId(request);
        CartDto cart = cartService.addToCart(userId, addRequest);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    // F22: Cập nhật số lượng
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateQuantity(
            HttpServletRequest request,
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest updateRequest) {
        Long userId = getUserId(request);
        CartDto cart = cartService.updateQuantity(userId, cartItemId, updateRequest);
        return ResponseEntity.ok(ApiResponse.ok("Quantity updated", cart));
    }

    // F23: Xóa sản phẩm khỏi giỏ
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeItem(
            HttpServletRequest request,
            @PathVariable Long cartItemId) {
        Long userId = getUserId(request);
        CartDto cart = cartService.removeItem(userId, cartItemId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    // F24: Xóa toàn bộ giỏ
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart(HttpServletRequest request) {
        Long userId = getUserId(request);
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", null));
    }
}
