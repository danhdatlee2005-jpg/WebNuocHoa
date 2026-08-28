package com.ecommerce.payment.config;

import com.ecommerce.common.constant.RabbitMQConstants;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQPaymentConfig {

    public static final String PAYMENT_ORDER_SAGA_QUEUE = "payment.order.saga.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(RabbitMQConstants.TOPIC_EXCHANGE);
    }

    @Bean
    public Queue paymentOrderSagaQueue() {
        return QueueBuilder.durable(PAYMENT_ORDER_SAGA_QUEUE).build();
    }

    @Bean
    public Binding bindInventoryReservedToPayment(Queue paymentOrderSagaQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(paymentOrderSagaQueue).to(topicExchange).with(RabbitMQConstants.RK_INVENTORY_RESERVED);
    }
}
