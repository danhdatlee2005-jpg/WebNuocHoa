package com.ecommerce.shipping.service;

import com.ecommerce.shipping.entity.Shipment;
import com.ecommerce.shipping.entity.ShipmentStatus;
import com.ecommerce.shipping.entity.ShippingMethod;
import com.ecommerce.shipping.repository.ShipmentRepository;
import com.ecommerce.shipping.repository.ShippingMethodRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShippingService {
    private final ShipmentRepository shipmentRepository;
    private final ShippingMethodRepository shippingMethodRepository;

    public List<ShippingMethod> getActiveShippingMethods() {
        return shippingMethodRepository.findByActiveTrue();
    }

    @Transactional
    public Shipment createShipment(Long orderId, Long methodId, String address) {
        log.info("Creating shipment for order: {}", orderId);
        
        ShippingMethod method = shippingMethodRepository.findById(methodId)
                .orElseThrow(() -> new RuntimeException("Shipping method not found"));

        Shipment shipment = Shipment.builder()
                .orderId(orderId)
                .shippingMethodId(methodId)
                .carrier(method.getCarrier())
                .trackingNumber(UUID.randomUUID().toString().replace("-", "").toUpperCase())
                .status(ShipmentStatus.PENDING)
                .shippingAddress(address)
                .estimatedDeliveryDate(LocalDateTime.now().plusDays(method.getEstimatedDays()))
                .build();

        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Shipment updateStatus(String trackingNumber, ShipmentStatus newStatus) {
        Shipment shipment = shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        
        shipment.setStatus(newStatus);
        
        if (newStatus == ShipmentStatus.SHIPPED) {
            shipment.setShippedDate(LocalDateTime.now());
        } else if (newStatus == ShipmentStatus.DELIVERED) {
            shipment.setActualDeliveryDate(LocalDateTime.now());
        }
        
        Shipment updated = shipmentRepository.save(shipment);
        
        // TODO: Publish ShipmentStatusUpdatedEvent to RabbitMQ for Notification/Order services
        log.info("Shipment {} updated to {}", trackingNumber, newStatus);
        return updated;
    }
}
