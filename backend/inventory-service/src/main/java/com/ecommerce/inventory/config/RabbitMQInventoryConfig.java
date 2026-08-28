package com.ecommerce.inventory.config;

import com.ecommerce.common.constant.RabbitMQConstants;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQInventoryConfig {

    public static final String INVENTORY_ORDER_EVENTS_QUEUE = "inventory.order.events.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(RabbitMQConstants.TOPIC_EXCHANGE);
    }

    @Bean
    public Queue inventoryOrderEventsQueue() {
        return QueueBuilder.durable(INVENTORY_ORDER_EVENTS_QUEUE).build();
    }

    @Bean
    public Binding bindOrderCreatedToInventory(Queue inventoryOrderEventsQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(inventoryOrderEventsQueue).to(topicExchange).with(RabbitMQConstants.RK_ORDER_CREATED);
    }

    @Bean
    public Binding bindOrderCancelledToInventory(Queue inventoryOrderEventsQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(inventoryOrderEventsQueue).to(topicExchange).with(RabbitMQConstants.RK_ORDER_CANCELLED);
    }

    @Bean
    public Binding bindPaymentFailedToInventory(Queue inventoryOrderEventsQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(inventoryOrderEventsQueue).to(topicExchange).with(RabbitMQConstants.RK_PAYMENT_FAILED);
    }
}
