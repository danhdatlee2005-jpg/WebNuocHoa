package com.ecommerce.user.config;

import com.ecommerce.common.constant.RabbitMQConstants;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQUserConfig {

    public static final String USER_REGISTERED_PROFILE_QUEUE = "user.registered.profile.queue";

    @Bean
    public TopicExchange topicExchange() {
        return new TopicExchange(RabbitMQConstants.TOPIC_EXCHANGE);
    }

    @Bean
    public Queue userRegisteredProfileQueue() {
        return QueueBuilder.durable(USER_REGISTERED_PROFILE_QUEUE).build();
    }

    @Bean
    public Binding bindingUserRegisteredProfile(Queue userRegisteredProfileQueue, TopicExchange topicExchange) {
        return BindingBuilder.bind(userRegisteredProfileQueue).to(topicExchange).with(RabbitMQConstants.RK_USER_REGISTERED);
    }
}
