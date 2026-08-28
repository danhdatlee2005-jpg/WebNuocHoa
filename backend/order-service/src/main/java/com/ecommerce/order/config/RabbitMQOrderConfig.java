package com.ecommerce.order.config;

import com.ecommerce.common.constant.RabbitMQConstants;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQOrderConfig {

    public static final String ORDER_SAGA_QUEUE = "order.saga.events.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(RabbitMQConstants.TOPIC_EXCHANGE);
    }

    @Bean
    public Queue orderSagaQueue() {
        return QueueBuilder.durable(ORDER_SAGA_QUEUE).build();
    }

    @Bean
    public Binding bindPaymentCompleted(Queue orderSagaQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(orderSagaQueue).to(topicExchange).with(RabbitMQConstants.RK_PAYMENT_COMPLETED);
    }

    @Bean
    public Binding bindPaymentFailed(Queue orderSagaQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(orderSagaQueue).to(topicExchange).with(RabbitMQConstants.RK_PAYMENT_FAILED);
    }

    @Bean
    public Binding bindInventoryFailed(Queue orderSagaQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(orderSagaQueue).to(topicExchange).with(RabbitMQConstants.RK_INVENTORY_RESERVATION_FAILED);
    }

    @Bean
    public Binding bindShipmentStatus(Queue orderSagaQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(orderSagaQueue).to(topicExchange).with(RabbitMQConstants.RK_SHIPMENT_DELIVERED);
    }
}
