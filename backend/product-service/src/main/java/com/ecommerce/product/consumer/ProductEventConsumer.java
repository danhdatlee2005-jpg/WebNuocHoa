package com.ecommerce.product.consumer;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.event.ReviewCreatedEvent;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductEventConsumer {

    private final ProductRepository productRepository;

    @RabbitListener(queues = "product.review.queue")
    @Transactional
    public void handleReviewCreated(ReviewCreatedEvent event) {
        if (event == null || event.getProductId() == null) return;
        try {
            log.info("Received ReviewCreatedEvent for productId: {}, rating: {}", event.getProductId(), event.getRating());
            productRepository.findById(event.getProductId()).ifPresent(product -> {
                int oldTotal = product.getTotalReviews() != null ? product.getTotalReviews() : 0;
                double oldRating = product.getRating() != null ? product.getRating() : 5.0;
                int rating = event.getRating() != null ? event.getRating() : 5;

                int newTotal = oldTotal + 1;
                double newRating = ((oldRating * oldTotal) + rating) / newTotal;

                product.setTotalReviews(newTotal);
                product.setRating(Math.round(newRating * 10.0) / 10.0);
                productRepository.save(product);
                log.info("Updated product rating to {} (total reviews: {})", product.getRating(), newTotal);
            });
        } catch (Exception e) {
            log.error("Error updating product reviews: {}", e.getMessage(), e);
        }
    }
}
