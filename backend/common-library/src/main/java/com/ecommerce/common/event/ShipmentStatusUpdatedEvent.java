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
public class ShipmentStatusUpdatedEvent extends BaseEvent {
    private Long shipmentId;
    private Long orderId;
    private Long customerId;
    private String trackingNumber;
    private String status;
    private String note;
}
