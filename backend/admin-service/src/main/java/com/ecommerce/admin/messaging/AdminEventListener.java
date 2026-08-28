package com.ecommerce.admin.messaging;

import com.ecommerce.admin.service.AdminStatisticService;
import com.ecommerce.common.event.OrderCreatedEvent;
import com.ecommerce.common.event.PaymentCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminEventListener {

    private final AdminStatisticService statisticService;

    @RabbitListener(queues = "${ecommerce.rabbitmq.queues.admin-events-queue}")
    public void handleAdminEvents(Object event) {
        if (event == null) return;
        try {
            if (event instanceof OrderCreatedEvent orderCreated) {
                log.info("Admin Service received OrderCreatedEvent for order: {}", orderCreated.getOrderId());
                statisticService.incrementOrders(LocalDate.now());
            } else if (event instanceof PaymentCompletedEvent paymentCompleted) {
                log.info("Admin Service received PaymentCompletedEvent for order: {}", paymentCompleted.getOrderId());
            }
        } catch (Exception e) {
            log.error("Error processing admin event: {}", e.getMessage(), e);
        }
    }
}
