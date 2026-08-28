package com.ecommerce.user.event;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.event.UserBlockedEvent;
import com.ecommerce.common.event.UserUnblockedEvent;
import com.ecommerce.common.event.UserUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishUserUpdated(UserUpdatedEvent event) {
        log.info("Publishing UserUpdatedEvent for userId: {}", event.getUserId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_USER_UPDATED, event);
    }

    public void publishUserBlocked(Long userId, String reason) {
        log.info("Publishing UserBlockedEvent for userId: {}", userId);
        UserBlockedEvent event = UserBlockedEvent.builder()
                .userId(userId)
                .reason(reason)
                .eventType("UserBlocked")
                .build();
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_USER_BLOCKED, event);
    }

    public void publishUserUnblocked(Long userId) {
        log.info("Publishing UserUnblockedEvent for userId: {}", userId);
        UserUnblockedEvent event = UserUnblockedEvent.builder()
                .userId(userId)
                .eventType("UserUnblocked")
                .build();
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_USER_UNBLOCKED, event);
    }
}
