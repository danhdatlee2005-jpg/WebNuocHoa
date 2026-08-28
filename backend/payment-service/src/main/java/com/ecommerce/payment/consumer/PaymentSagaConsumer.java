package com.ecommerce.payment.consumer;

import com.ecommerce.common.enums.PaymentStatus;
import com.ecommerce.common.event.BaseEvent;
import com.ecommerce.common.event.InventoryReservedEvent;
import com.ecommerce.payment.config.RabbitMQPaymentConfig;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.entity.ProcessedEvent;
import com.ecommerce.payment.repository.PaymentRepository;
import com.ecommerce.payment.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentSagaConsumer {

    private final PaymentRepository paymentRepository;
    private final ProcessedEventRepository processedEventRepository;

    @RabbitListener(queues = RabbitMQPaymentConfig.PAYMENT_ORDER_SAGA_QUEUE)
    @Transactional
    public void handleInventoryReserved(BaseEvent event) {
        if (event == null) {
            log.warn("Payment Service received null event, skipping.");
            return;
        }

        log.info("Payment Service received Saga Event: {} (id: {})", event.getEventType(), event.getEventId());

        if (event.getEventId() != null && processedEventRepository.existsById(event.getEventId())) {
            log.warn("Event {} already processed by Payment Service", event.getEventId());
            return;
        }

        try {
            if (event instanceof InventoryReservedEvent reservedEvent) {
                log.info("Inventory reserved for order #{}. Payment service is ready for processing.", reservedEvent.getOrderId());
            }

            if (event.getEventId() != null) {
                processedEventRepository.save(ProcessedEvent.builder()
                        .eventId(event.getEventId())
                        .eventType(event.getEventType())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error processing event {} in Payment Service: {}", event.getEventId(), e.getMessage(), e);
        }
    }
}
