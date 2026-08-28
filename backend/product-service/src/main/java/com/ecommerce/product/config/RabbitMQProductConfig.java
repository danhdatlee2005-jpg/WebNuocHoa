package com.ecommerce.product.config;

import com.ecommerce.common.constant.RabbitMQConstants;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQProductConfig {

    public static final String PRODUCT_REVIEW_QUEUE = "product.review.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(RabbitMQConstants.TOPIC_EXCHANGE);
    }

    @Bean
    public Queue productReviewQueue() {
        return QueueBuilder.durable(PRODUCT_REVIEW_QUEUE).build();
    }

    @Bean
    public Binding bindingProductReview(Queue productReviewQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(productReviewQueue).to(topicExchange).with(RabbitMQConstants.RK_REVIEW_CREATED);
    }
}
