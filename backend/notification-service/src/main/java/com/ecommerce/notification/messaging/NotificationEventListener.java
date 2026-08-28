package com.ecommerce.notification.messaging;

import com.ecommerce.common.event.OrderCreatedEvent;
import com.ecommerce.common.event.ShipmentStatusUpdatedEvent;
import com.ecommerce.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;

    @RabbitListener(queues = "${ecommerce.rabbitmq.queues.notification-events-queue}")
    public void handleNotificationEvents(Object event) {
        if (event == null) return;
        try {
            if (event instanceof OrderCreatedEvent orderCreated) {
                log.info("Received OrderCreatedEvent in Notification Service for Customer ID: {}", orderCreated.getCustomerId());
                String total = orderCreated.getTotalAmount() != null ? orderCreated.getTotalAmount().toString() : "0";
                String message = String.format("Đơn hàng #%d của bạn đã được tạo thành công với tổng tiền %s.", 
                                               orderCreated.getOrderId(), total);
                if (orderCreated.getCustomerId() != null) {
                    notificationService.createNotification(orderCreated.getCustomerId(), "Tạo đơn hàng thành công", message, "ORDER");
                }
            } else if (event instanceof ShipmentStatusUpdatedEvent shipmentUpdated) {
                log.info("Received ShipmentStatusUpdatedEvent in Notification Service for Order ID: {}", shipmentUpdated.getOrderId());
                Long userId = 1L;
                String message = String.format("Đơn hàng #%d của bạn đã cập nhật trạng thái vận chuyển: %s.", 
                                               shipmentUpdated.getOrderId(), shipmentUpdated.getStatus());
                notificationService.createNotification(userId, "Cập nhật trạng thái giao hàng", message, "ORDER");
            } else {
                log.debug("Notification Service ignoring unknown event type: {}", event.getClass().getSimpleName());
            }
        } catch (Exception e) {
            log.error("Error processing notification event: {}", e.getMessage(), e);
        }
    }
}
