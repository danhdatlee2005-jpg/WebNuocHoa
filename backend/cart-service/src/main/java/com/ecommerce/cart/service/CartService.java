package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.AddToCartRequest;
import com.ecommerce.cart.dto.CartDto;
import com.ecommerce.cart.dto.CartItemDto;
import com.ecommerce.cart.dto.UpdateCartItemRequest;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.repository.CartItemRepository;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartItemRepository cartItemRepository;

    // F21: Xem giỏ hàng
    @Transactional(readOnly = true)
    public CartDto getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findAllByUserId(userId);
        List<CartItemDto> itemDtos = items.stream().map(this::mapToDto).collect(Collectors.toList());

        BigDecimal subtotal = items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream().mapToInt(CartItem::getQuantity).sum();

        return CartDto.builder()
                .userId(userId)
                .items(itemDtos)
                .totalItems(totalItems)
                .subtotal(subtotal)
                .build();
    }

    // F20: Thêm sản phẩm vào giỏ
    @Transactional
    public CartDto addToCart(Long userId, AddToCartRequest request) {
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductIdAndVariantId(
                userId, request.getProductId(), request.getVariantId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setUnitPrice(request.getUnitPrice()); // Update to current price
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .userId(userId)
                    .productId(request.getProductId())
                    .variantId(request.getVariantId())
                    .productName(request.getProductName().trim())
                    .variantName(request.getVariantName())
                    .imageUrl(request.getImageUrl())
                    .unitPrice(request.getUnitPrice())
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(userId);
    }

    // F22: Cập nhật số lượng
    @Transactional
    public CartDto updateQuantity(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUserId().equals(userId)) {
            throw new ForbiddenException("You can only modify your own cart");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return getCart(userId);
    }

    // F23: Xóa sản phẩm khỏi giỏ
    @Transactional
    public CartDto removeItem(Long userId, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUserId().equals(userId)) {
            throw new ForbiddenException("You can only modify your own cart");
        }

        cartItemRepository.delete(item);
        return getCart(userId);
    }

    // F24: Xóa toàn bộ giỏ
    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteAllByUserId(userId);
    }

    private CartItemDto mapToDto(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .productName(item.getProductName())
                .variantName(item.getVariantName())
                .imageUrl(item.getImageUrl())
                .unitPrice(item.getUnitPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getSubtotal())
                .build();
    }
}
