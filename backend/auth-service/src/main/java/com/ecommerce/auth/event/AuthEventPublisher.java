package com.ecommerce.auth.event;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.event.PasswordResetRequestedEvent;
import com.ecommerce.common.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishUserRegistered(UserRegisteredEvent event) {
        log.info("Publishing UserRegisteredEvent for user: {}", event.getEmail());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_USER_REGISTERED, event);
    }

    public void publishPasswordResetRequested(PasswordResetRequestedEvent event) {
        log.info("Publishing PasswordResetRequestedEvent for email: {}", event.getEmail());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_PASSWORD_RESET_REQUESTED, event);
    }
}
