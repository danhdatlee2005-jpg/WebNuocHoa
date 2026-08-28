package com.ecommerce.product.event;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.event.ProductCreatedEvent;
import com.ecommerce.common.event.ProductUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishProductCreated(ProductCreatedEvent event) {
        log.info("Publishing ProductCreatedEvent for productId: {}", event.getProductId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_PRODUCT_CREATED, event);
    }

    public void publishProductUpdated(ProductUpdatedEvent event) {
        log.info("Publishing ProductUpdatedEvent for productId: {}", event.getProductId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_PRODUCT_UPDATED, event);
    }
}
