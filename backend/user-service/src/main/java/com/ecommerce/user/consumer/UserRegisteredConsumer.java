package com.ecommerce.user.consumer;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.enums.Role;
import com.ecommerce.common.event.UserRegisteredEvent;
import com.ecommerce.user.entity.UserProfile;
import com.ecommerce.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserRegisteredConsumer {

    private final UserProfileRepository userProfileRepository;

    @RabbitListener(queues = "user.registered.profile.queue")
    @Transactional
    public void handleUserRegistered(UserRegisteredEvent event) {
        if (event == null || event.getUserId() == null) {
            log.warn("UserRegisteredConsumer received null or invalid event");
            return;
        }
        try {
            log.info("Received UserRegisteredEvent for userId: {}, email: {}", event.getUserId(), event.getEmail());
            if (!userProfileRepository.existsById(event.getUserId())) {
                Role role = Role.CUSTOMER;
                if (event.getRole() != null) {
                    try {
                        role = Role.valueOf(event.getRole());
                    } catch (IllegalArgumentException ignored) {}
                }
                UserProfile profile = UserProfile.builder()
                        .id(event.getUserId())
                        .email(event.getEmail())
                        .fullName(event.getFullName())
                        .phoneNumber(event.getPhoneNumber())
                        .role(role)
                        .blocked(false)
                        .build();
                userProfileRepository.save(profile);
                log.info("User profile created for userId: {}", event.getUserId());
            }
        } catch (Exception e) {
            log.error("Error processing UserRegisteredEvent: {}", e.getMessage(), e);
        }
    }
}
