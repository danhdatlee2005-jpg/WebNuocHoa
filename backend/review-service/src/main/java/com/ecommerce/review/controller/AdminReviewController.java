package com.ecommerce.review.controller;

import com.ecommerce.common.dto.ApiResponse;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.security.JwtTokenProvider;
import com.ecommerce.common.security.SecurityContextUtil;
import com.ecommerce.review.entity.Review;
import com.ecommerce.review.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;
    private final JwtTokenProvider jwtTokenProvider;

    private void checkAdmin(HttpServletRequest request) {
        String role = SecurityContextUtil.getUserRole(request, jwtTokenProvider);
        if (!"ADMIN".equals(role)) {
            throw new ForbiddenException("Access denied: ADMIN role required");
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Review>>> getAllReviews(HttpServletRequest request) {
        checkAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getAllReviews()));
    }

    @PatchMapping("/{reviewId}/approve")
    public ResponseEntity<ApiResponse<Review>> approveReview(HttpServletRequest request, @PathVariable Long reviewId) {
        checkAdmin(request);
        Review review = reviewService.approveReview(reviewId);
        return ResponseEntity.ok(ApiResponse.ok("Review approved successfully", review));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(HttpServletRequest request, @PathVariable Long reviewId) {
        checkAdmin(request);
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.ok("Review deleted successfully", null));
    }
}
