package com.ecommerce.auth.consumer;

import com.ecommerce.auth.repository.RefreshTokenRepository;
import com.ecommerce.auth.repository.UserAuthRepository;
import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.event.UserBlockedEvent;
import com.ecommerce.common.event.UserUnblockedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventConsumer {

    private final UserAuthRepository userAuthRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @RabbitListener(queues = RabbitMQConstants.AUTH_USER_QUEUE)
    @Transactional
    public void handleUserEvents(Object event) {
        if (event instanceof UserBlockedEvent blockedEvent) {
            log.info("Handling UserBlockedEvent for userId: {}", blockedEvent.getUserId());
            userAuthRepository.findById(blockedEvent.getUserId()).ifPresent(user -> {
                user.setBlocked(true);
                userAuthRepository.save(user);
                refreshTokenRepository.revokeAllByUserId(user.getId());
            });
        }
    }
}
