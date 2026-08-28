package com.ecommerce.inventory.event;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.event.InventoryIncreasedEvent;
import com.ecommerce.common.event.InventoryReleasedEvent;
import com.ecommerce.common.event.InventoryReservationFailedEvent;
import com.ecommerce.common.event.InventoryReservedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishInventoryReserved(InventoryReservedEvent event) {
        log.info("Publishing InventoryReservedEvent for orderId: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_INVENTORY_RESERVED, event);
    }

    public void publishInventoryReservationFailed(InventoryReservationFailedEvent event) {
        log.warn("Publishing InventoryReservationFailedEvent for orderId: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_INVENTORY_RESERVATION_FAILED, event);
    }

    public void publishInventoryReleased(InventoryReleasedEvent event) {
        log.info("Publishing InventoryReleasedEvent for orderId: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_INVENTORY_RELEASED, event);
    }

    public void publishInventoryIncreased(InventoryIncreasedEvent event) {
        log.info("Publishing InventoryIncreasedEvent for productId: {}", event.getProductId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_INVENTORY_INCREASED, event);
    }
}
