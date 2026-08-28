package com.ecommerce.wishlist.service;

import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.wishlist.dto.WishlistDtoWrapper;
import com.ecommerce.wishlist.entity.WishlistItem;
import com.ecommerce.wishlist.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;

    // F27: Xem Wishlist
    @Transactional(readOnly = true)
    public List<WishlistDtoWrapper.WishlistItemDto> getWishlist(Long userId) {
        return wishlistItemRepository.findAllByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // F25: Thêm sản phẩm yêu thích (Chặn thêm trùng lặp)
    @Transactional
    public WishlistDtoWrapper.WishlistItemDto addToWishlist(Long userId, WishlistDtoWrapper.AddToWishlistRequest request) {
        if (wishlistItemRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new BadRequestException("Product already in wishlist");
        }

        WishlistItem item = WishlistItem.builder()
                .userId(userId)
                .productId(request.getProductId())
                .productName(request.getProductName().trim())
                .brand(request.getBrand())
                .imageUrl(request.getImageUrl())
                .price(request.getPrice())
                .rating(request.getRating())
                .inStock(request.isInStock())
                .build();

        WishlistItem saved = wishlistItemRepository.save(item);
        return mapToDto(saved);
    }

    // F26: Xóa sản phẩm yêu thích
    @Transactional
    public void removeFromWishlist(Long userId, Long wishlistItemId) {
        WishlistItem item = wishlistItemRepository.findById(wishlistItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));

        if (!item.getUserId().equals(userId)) {
            throw new ForbiddenException("You can only modify your own wishlist");
        }

        wishlistItemRepository.delete(item);
    }

    // Check if a product is in user's wishlist
    @Transactional(readOnly = true)
    public boolean checkInWishlist(Long userId, Long productId) {
        return wishlistItemRepository.existsByUserIdAndProductId(userId, productId);
    }

    private WishlistDtoWrapper.WishlistItemDto mapToDto(WishlistItem item) {
        return WishlistDtoWrapper.WishlistItemDto.builder()
                .id(item.getId())
                .userId(item.getUserId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .brand(item.getBrand())
                .imageUrl(item.getImageUrl())
                .price(item.getPrice())
                .rating(item.getRating())
                .inStock(item.isInStock())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
