package com.ecommerce.order.consumer;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.enums.OrderStatus;
import com.ecommerce.common.enums.PaymentStatus;
import com.ecommerce.common.event.*;
import com.ecommerce.order.config.RabbitMQOrderConfig;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.ProcessedEvent;
import com.ecommerce.order.event.OrderEventPublisher;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderSagaConsumer {

    private final OrderRepository orderRepository;
    private final ProcessedEventRepository processedEventRepository;
    private final OrderEventPublisher orderEventPublisher;

    @RabbitListener(queues = RabbitMQOrderConfig.ORDER_SAGA_QUEUE)
    @Transactional
    public void handleSagaEvent(BaseEvent event) {
        if (event == null) {
            log.warn("Order Service received null event, skipping.");
            return;
        }

        log.info("Order Service received Saga Event: {} with eventId: {}", event.getEventType(), event.getEventId());

        // Rule 4: Chống xử lý lặp (Idempotency)
        if (event.getEventId() != null && processedEventRepository.existsById(event.getEventId())) {
            log.warn("Event {} already processed, skipping.", event.getEventId());
            return;
        }

        try {
            if (event instanceof PaymentCompletedEvent paymentCompleted) {
                handlePaymentCompleted(paymentCompleted);
            } else if (event instanceof PaymentFailedEvent paymentFailed) {
                handlePaymentFailed(paymentFailed);
            } else if (event instanceof InventoryReservationFailedEvent inventoryFailed) {
                handleInventoryFailed(inventoryFailed);
            } else if (event instanceof ShipmentStatusUpdatedEvent shipmentUpdated) {
                handleShipmentUpdated(shipmentUpdated);
            }

            // Ghi nhận đã xử lý
            if (event.getEventId() != null) {
                processedEventRepository.save(ProcessedEvent.builder()
                        .eventId(event.getEventId())
                        .eventType(event.getEventType())
                        .build());
            }
        } catch (Exception e) {
            log.error("Error processing event {} in Order Service: {}", event.getEventId(), e.getMessage(), e);
        }
    }

    private void handlePaymentCompleted(PaymentCompletedEvent event) {
        orderRepository.findById(event.getOrderId()).ifPresent(order -> {
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            order.setOrderStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
            log.info("Order #{} marked as CONFIRMED following PaymentCompleted", order.getId());

            // Trigger shipping & notification
            orderEventPublisher.publishOrderConfirmed(OrderConfirmedEvent.builder()
                    .orderId(order.getId())
                    .customerId(order.getCustomerId())
                    .customerEmail(order.getCustomerEmail())
                    .customerName(order.getCustomerName())
                    .totalAmount(order.getTotalAmount())
                    .shippingAddress(order.getShippingAddress())
                    .paymentMethod(order.getPaymentMethod())
                    .eventType("OrderConfirmed")
                    .build());
        });
    }

    private void handlePaymentFailed(PaymentFailedEvent event) {
        orderRepository.findById(event.getOrderId()).ifPresent(order -> {
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setOrderStatus(OrderStatus.PAYMENT_FAILED);
            orderRepository.save(order);
            log.warn("Order #{} marked as PAYMENT_FAILED: {}", order.getId(), event.getReason());
        });
    }

    private void handleInventoryFailed(InventoryReservationFailedEvent event) {
        orderRepository.findById(event.getOrderId()).ifPresent(order -> {
            order.setOrderStatus(OrderStatus.CANCELLED);
            order.setNotes("Cancelled: Inventory insufficient (" + event.getReason() + ")");
            orderRepository.save(order);
            log.warn("Order #{} cancelled due to inventory shortage", order.getId());
        });
    }

    private void handleShipmentUpdated(ShipmentStatusUpdatedEvent event) {
        orderRepository.findById(event.getOrderId()).ifPresent(order -> {
            if ("DELIVERED".equalsIgnoreCase(event.getStatus())) {
                order.setOrderStatus(OrderStatus.DELIVERED);
                orderRepository.save(order);

                orderEventPublisher.publishOrderDelivered(OrderDeliveredEvent.builder()
                        .orderId(order.getId())
                        .customerId(order.getCustomerId())
                        .eventType("OrderDelivered")
                        .build());
            } else if ("IN_TRANSIT".equalsIgnoreCase(event.getStatus())) {
                order.setOrderStatus(OrderStatus.SHIPPED);
                orderRepository.save(order);
            }
        });
    }
}
