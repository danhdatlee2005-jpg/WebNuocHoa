package com.ecommerce.payment.event;

import com.ecommerce.common.constant.RabbitMQConstants;
import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.common.event.PaymentFailedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Publishing PaymentCompletedEvent for orderId: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_PAYMENT_COMPLETED, event);
    }

    public void publishPaymentFailed(PaymentFailedEvent event) {
        log.warn("Publishing PaymentFailedEvent for orderId: {}", event.getOrderId());
        rabbitTemplate.convertAndSend(RabbitMQConstants.TOPIC_EXCHANGE, RabbitMQConstants.RK_PAYMENT_FAILED, event);
    }
}
