package com.ecommerce.auth.config;

import com.ecommerce.common.constant.RabbitMQConstants;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQAuthConfig {

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(RabbitMQConstants.TOPIC_EXCHANGE);
    }

    @Bean
    public Queue authUserQueue() {
        return QueueBuilder.durable(RabbitMQConstants.AUTH_USER_QUEUE).build();
    }

    @Bean
    public Binding bindingUserBlocked(Queue authUserQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(authUserQueue).to(topicExchange).with(RabbitMQConstants.RK_USER_BLOCKED);
    }
}
