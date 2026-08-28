package com.ecommerce.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ShipmentCreatedEvent extends BaseEvent {
    private Long shipmentId;
    private Long orderId;
    private Long customerId;
    private String trackingNumber;
    private String shippingProvider;
    private String recipientName;
    private String shippingAddress;
}
