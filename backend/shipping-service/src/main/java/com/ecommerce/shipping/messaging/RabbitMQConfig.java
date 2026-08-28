package com.ecommerce.shipping.messaging;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${ecommerce.rabbitmq.exchange}")
    private String exchange;

    @Value("${ecommerce.rabbitmq.queues.shipping-events-queue}")
    private String shippingQueue;

    @Value("${ecommerce.rabbitmq.routing-keys.payment-completed}")
    private String paymentCompletedRoutingKey;

    @Value("${ecommerce.rabbitmq.routing-keys.order-confirmed}")
    private String orderConfirmedRoutingKey;

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(exchange);
    }

    @Bean
    public Queue shippingQueue() {
        return new Queue(shippingQueue, true);
    }

    @Bean
    public Binding paymentCompletedBinding(Queue shippingQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(shippingQueue).to(topicExchange).with(paymentCompletedRoutingKey);
    }

    @Bean
    public Binding orderConfirmedBinding(Queue shippingQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(shippingQueue).to(topicExchange).with(orderConfirmedRoutingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
