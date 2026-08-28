package com.ecommerce.shipping.messaging;

import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.common.event.ShipmentStatusUpdatedEvent;
import com.ecommerce.shipping.entity.Shipment;
import com.ecommerce.shipping.entity.ShipmentStatus;
import com.ecommerce.shipping.service.ShippingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class SagaEventListener {

    private final ShippingService shippingService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${ecommerce.rabbitmq.exchange}")
    private String exchange;

    @Value("${ecommerce.rabbitmq.routing-keys.shipment-updated}")
    private String shipmentUpdatedRoutingKey;

    @RabbitListener(queues = "${ecommerce.rabbitmq.queues.shipping-events-queue}")
    public void handlePaymentCompletedEvent(PaymentCompletedEvent event) {
        log.info("Received PaymentCompletedEvent for Order ID: {}", event.getOrderId());
        
        try {
            // F45: Create shipment on Order Confirmed/Payment Completed
            // Defaulting methodId to 1 and address to a placeholder for automated creation,
            // normally address would come from the event payload.
            Long defaultMethodId = 1L;
            String address = "Address from Order"; // Usually from Order snapshot or Event

            Shipment shipment = shippingService.createShipment(event.getOrderId(), defaultMethodId, address);
            
            // Publish status update
            ShipmentStatusUpdatedEvent updateEvent = ShipmentStatusUpdatedEvent.builder()
                    .eventId(java.util.UUID.randomUUID().toString())
                    .timestamp(LocalDateTime.now())
                    .orderId(shipment.getOrderId())
                    .trackingNumber(shipment.getTrackingNumber())
                    .status(shipment.getStatus().name())
                    .build();

            rabbitTemplate.convertAndSend(exchange, shipmentUpdatedRoutingKey, updateEvent);
            log.info("Shipment created and event published for Order ID: {}", event.getOrderId());
        } catch (Exception e) {
            log.error("Failed to process PaymentCompletedEvent for Order ID: {}", event.getOrderId(), e);
        }
    }
}
