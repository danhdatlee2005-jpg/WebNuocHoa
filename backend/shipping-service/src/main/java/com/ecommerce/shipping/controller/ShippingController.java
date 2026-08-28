package com.ecommerce.shipping.controller;

import com.ecommerce.shipping.entity.Shipment;
import com.ecommerce.shipping.entity.ShipmentStatus;
import com.ecommerce.shipping.entity.ShippingMethod;
import com.ecommerce.shipping.service.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/shipping")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    @GetMapping("/methods")
    public ResponseEntity<List<ShippingMethod>> getMethods() {
        return ResponseEntity.ok(shippingService.getActiveShippingMethods());
    }

    @PostMapping("/shipments")
    public ResponseEntity<Shipment> createShipment(
            @RequestParam Long orderId,
            @RequestParam Long methodId,
            @RequestBody String address) {
        return ResponseEntity.ok(shippingService.createShipment(orderId, methodId, address));
    }

    @PutMapping("/shipments/{trackingNumber}/status")
    public ResponseEntity<Shipment> updateStatus(
            @PathVariable String trackingNumber,
            @RequestParam ShipmentStatus status) {
        return ResponseEntity.ok(shippingService.updateStatus(trackingNumber, status));
    }
}
