package com.ecommerce.inventory.consumer;

import com.ecommerce.common.event.BaseEvent;
import com.ecommerce.common.event.OrderCancelledEvent;
import com.ecommerce.common.event.OrderCreatedEvent;
import com.ecommerce.common.event.PaymentFailedEvent;
import com.ecommerce.inventory.config.RabbitMQInventoryConfig;
import com.ecommerce.inventory.entity.ProcessedEvent;
import com.ecommerce.inventory.repository.ProcessedEventRepository;
import com.ecommerce.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventorySagaConsumer {

    private final InventoryService inventoryService;
    private final ProcessedEventRepository processedEventRepository;

    @RabbitListener(queues = RabbitMQInventoryConfig.INVENTORY_ORDER_EVENTS_QUEUE)
    @Transactional
    public void handleInventorySagaEvents(BaseEvent event) {
        if (event == null) {
            log.warn("Inventory Service received null event, skipping.");
            return;
        }

        log.info("Inventory Service received event: {} (id: {})", event.getEventType(), event.getEventId());

        // Rule 4: Chống xử lý lặp (idempotency) — chỉ check khi eventId không null
        if (event.getEventId() != null && processedEventRepository.existsById(event.getEventId())) {
            log.warn("Event {} already processed by Inventory Service, skipping.", event.getEventId());
            return;
        }

        try {
            if (event instanceof OrderCreatedEvent orderCreated) {
                inventoryService.processOrderReservation(orderCreated);
            } else if (event instanceof OrderCancelledEvent orderCancelled) {
                inventoryService.releaseReservation(orderCancelled.getOrderId(), orderCancelled.getReason());
            } else if (event instanceof PaymentFailedEvent paymentFailed) {
                inventoryService.releaseReservation(paymentFailed.getOrderId(), paymentFailed.getReason());
            } else {
                log.debug("Inventory Service ignoring unknown event type: {}", event.getEventType());
                return;
            }

            // Chỉ lưu processedEvent khi có eventId hợp lệ
            if (event.getEventId() != null) {
                processedEventRepository.save(ProcessedEvent.builder()
                        .eventId(event.getEventId())
                        .eventType(event.getEventType())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error processing event {} in Inventory Service: {}", event.getEventId(), e.getMessage(), e);
            // Không throw exception để tránh RabbitMQ retry vô hạn gây lag CPU
        }
    }
}
