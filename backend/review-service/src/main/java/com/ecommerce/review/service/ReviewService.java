package com.ecommerce.review.service;

import com.ecommerce.common.event.ReviewCreatedEvent;
import com.ecommerce.review.entity.Review;
import com.ecommerce.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${ecommerce.rabbitmq.exchange}")
    private String exchange;

    @Value("${ecommerce.rabbitmq.routing-keys.review-created}")
    private String reviewCreatedRoutingKey;

    @Transactional
    public Review createReview(Long userId, Long productId, Long orderId, Integer rating, String comment) {
        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Check if already reviewed for this order
        if (reviewRepository.findByUserIdAndProductIdAndOrderId(userId, productId, orderId).isPresent()) {
            throw new IllegalStateException("User has already reviewed this product for the given order");
        }

        Review review = Review.builder()
                .userId(userId)
                .productId(productId)
                .orderId(orderId)
                .rating(rating)
                .comment(comment)
                .approved(false)
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);
        
        // Publish event to update product average rating in Product Service
        ReviewCreatedEvent event = ReviewCreatedEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .timestamp(LocalDateTime.now())
                .productId(productId)
                .rating(rating)
                .build();
                
        rabbitTemplate.convertAndSend(exchange, reviewCreatedRoutingKey, event);
        log.info("Review created and event published for Product ID: {}", productId);

        return savedReview;
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Transactional
    public Review approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));
        review.setApproved(true);
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new IllegalArgumentException("Review not found with id: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }
}
