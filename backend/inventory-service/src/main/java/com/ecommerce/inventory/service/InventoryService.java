package com.ecommerce.inventory.service;

import com.ecommerce.common.event.*;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.inventory.dto.InventoryDtoWrapper;
import com.ecommerce.inventory.entity.InventoryItem;
import com.ecommerce.inventory.entity.InventoryReservation;
import com.ecommerce.inventory.entity.InventoryTransaction;
import com.ecommerce.inventory.event.InventoryEventPublisher;
import com.ecommerce.inventory.repository.InventoryItemRepository;
import com.ecommerce.inventory.repository.InventoryReservationRepository;
import com.ecommerce.inventory.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryReservationRepository inventoryReservationRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryEventPublisher inventoryEventPublisher;

    // F33, F59: Xem tồn kho
    @Transactional(readOnly = true)
    public List<InventoryDtoWrapper.InventoryDto> getAllInventory() {
        return inventoryItemRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // F59: Xem sản phẩm sắp hết hàng
    @Transactional(readOnly = true)
    public List<InventoryDtoWrapper.InventoryDto> getLowStockItems() {
        return inventoryItemRepository.findLowStockItems().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // F34: Nhập kho (Admin Restock / Inward)
    @Transactional
    public InventoryDtoWrapper.InventoryDto restock(InventoryDtoWrapper.RestockRequest request) {
        Optional<InventoryItem> existing = inventoryItemRepository.findByProductIdAndVariantId(
                request.getProductId(), request.getVariantId());

        InventoryItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setTotalQuantity(item.getTotalQuantity() + request.getQuantity());
        } else {
            item = InventoryItem.builder()
                    .productId(request.getProductId())
                    .variantId(request.getVariantId())
                    .productName(request.getProductName())
                    .variantName(request.getVariantName())
                    .sku(request.getSku())
                    .totalQuantity(request.getQuantity())
                    .reservedQuantity(0)
                    .lowStockThreshold(10)
                    .build();
        }

        InventoryItem saved = inventoryItemRepository.save(item);

        // Ghi log Transaction
        InventoryTransaction tx = InventoryTransaction.builder()
                .productId(saved.getProductId())
                .variantId(saved.getVariantId())
                .transactionType("RESTOCK")
                .quantity(request.getQuantity())
                .supplier(request.getSupplier())
                .build();
        inventoryTransactionRepository.save(tx);

        // Phát sinh InventoryIncreased
        InventoryIncreasedEvent event = InventoryIncreasedEvent.builder()
                .productId(saved.getProductId())
                .variantId(saved.getVariantId())
                .quantityAdded(request.getQuantity())
                .supplier(request.getSupplier())
                .eventType("InventoryIncreased")
                .build();
        inventoryEventPublisher.publishInventoryIncreased(event);

        return mapToDto(saved);
    }

    // F59: Điều chỉnh tồn kho thủ công
    @Transactional
    public InventoryDtoWrapper.InventoryDto adjustStock(Long inventoryId, InventoryDtoWrapper.AdjustStockRequest request) {
        InventoryItem item = inventoryItemRepository.findById(inventoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        int diff = request.getNewTotalQuantity() - item.getTotalQuantity();
        item.setTotalQuantity(request.getNewTotalQuantity());
        InventoryItem saved = inventoryItemRepository.save(item);

        InventoryTransaction tx = InventoryTransaction.builder()
                .productId(saved.getProductId())
                .variantId(saved.getVariantId())
                .transactionType("ADJUSTMENT")
                .quantity(diff)
                .reason(request.getReason())
                .build();
        inventoryTransactionRepository.save(tx);

        return mapToDto(saved);
    }

    // F35: Reserve Inventory (Async Saga Step from OrderCreated)
    @Transactional
    public void processOrderReservation(OrderCreatedEvent event) {
        log.info("Processing inventory reservation for order #{}", event.getOrderId());

        boolean allAvailable = true;
        List<InventoryItem> itemsToReserve = new ArrayList<>();

        for (OrderCreatedEvent.OrderItemEventDto item : event.getItems()) {
            InventoryItem inv = null;
            if (item.getVariantId() != null) {
                inv = inventoryItemRepository.findByProductIdAndVariantId(item.getProductId(), item.getVariantId()).orElse(null);
            }
            if (inv == null) {
                inv = inventoryItemRepository.findFirstByProductId(item.getProductId()).orElse(null);
            }
            if (inv == null) {
                // Tự động khởi tạo tồn kho nếu sản phẩm chưa có trong kho
                inv = InventoryItem.builder()
                        .productId(item.getProductId())
                        .variantId(item.getVariantId() != null ? item.getVariantId() : 1L)
                        .productName(item.getProductName() != null ? item.getProductName() : "Product #" + item.getProductId())
                        .variantName(item.getVariantName() != null ? item.getVariantName() : "Standard")
                        .sku("SKU-" + item.getProductId() + (item.getVariantId() != null ? "-" + item.getVariantId() : ""))
                        .totalQuantity(100)
                        .reservedQuantity(0)
                        .lowStockThreshold(5)
                        .build();
                inv = inventoryItemRepository.save(inv);
                log.info("Auto-initialized inventory item for productId: {}", item.getProductId());
            }

            if (inv.getAvailableQuantity() < item.getQuantity()) {
                allAvailable = false;
                break;
            }
            itemsToReserve.add(inv);
        }

        if (allAvailable) {
            for (int i = 0; i < event.getItems().size(); i++) {
                OrderCreatedEvent.OrderItemEventDto item = event.getItems().get(i);
                InventoryItem inv = itemsToReserve.get(i);

            int quantity = item.getQuantity();
            inv.setTotalQuantity(inv.getTotalQuantity() - quantity);
            inv.setReservedQuantity(inv.getReservedQuantity() + quantity);
            inventoryItemRepository.save(inv);

            InventoryReservation res = InventoryReservation.builder()
                    .orderId(event.getOrderId())
                    .productId(item.getProductId())
                    .variantId(item.getVariantId())
                    .quantity(quantity)
                    .status("RESERVED")
                    .build();
            inventoryReservationRepository.save(res);
        }

        log.info("Inventory successfully reserved for order #{}", event.getOrderId());
        inventoryEventPublisher.publishInventoryReserved(InventoryReservedEvent.builder()
                .orderId(event.getOrderId())
                .customerId(event.getCustomerId())
                .eventType("InventoryReserved")
                .build());
        } else {
            log.warn("Inventory insufficient for order #{}", event.getOrderId());
            inventoryEventPublisher.publishInventoryReservationFailed(InventoryReservationFailedEvent.builder()
                    .orderId(event.getOrderId())
                    .customerId(event.getCustomerId())
                    .reason("One or more items in the cart are out of stock")
                    .eventType("InventoryReservationFailed")
                    .build());
        }
    }

    // F36: Release Inventory (Compensating Transaction when OrderCancelled / PaymentFailed)
    @Transactional
    public void releaseReservation(Long orderId, String reason) {
        log.info("Releasing inventory reservation for order #{}, reason: {}", orderId, reason);
        List<InventoryReservation> reservations = inventoryReservationRepository.findAllByOrderIdAndStatus(orderId, "RESERVED");

        for (InventoryReservation res : reservations) {
            InventoryItem item = null;
            if (res.getVariantId() != null) {
                item = inventoryItemRepository.findByProductIdAndVariantId(res.getProductId(), res.getVariantId()).orElse(null);
            }
            if (item == null) {
                item = inventoryItemRepository.findFirstByProductId(res.getProductId()).orElse(null);
            }
            if (item != null) {
                int newReserved = Math.max(0, item.getReservedQuantity() - res.getQuantity());
                item.setReservedQuantity(newReserved);
                item.setTotalQuantity(item.getTotalQuantity() + res.getQuantity());
                inventoryItemRepository.save(item);
            }

            res.setStatus("RELEASED");
            inventoryReservationRepository.save(res);

            InventoryTransaction tx = InventoryTransaction.builder()
                    .productId(res.getProductId())
                    .variantId(res.getVariantId())
                    .transactionType("RELEASE")
                    .quantity(res.getQuantity())
                    .orderId(orderId)
                    .reason(reason)
                    .build();
            inventoryTransactionRepository.save(tx);
        }

        inventoryEventPublisher.publishInventoryReleased(InventoryReleasedEvent.builder()
                .orderId(orderId)
                .reason(reason)
                .eventType("InventoryReleased")
                .build());
    }

    // F59: Lịch sử nhập xuất kho
    @Transactional(readOnly = true)
    public Page<InventoryDtoWrapper.TransactionDto> getTransactions(Pageable pageable) {
        return inventoryTransactionRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(t -> InventoryDtoWrapper.TransactionDto.builder()
                        .id(t.getId())
                        .productId(t.getProductId())
                        .variantId(t.getVariantId())
                        .transactionType(t.getTransactionType())
                        .quantity(t.getQuantity())
                        .supplier(t.getSupplier())
                        .orderId(t.getOrderId())
                        .reason(t.getReason())
                        .createdAt(t.getCreatedAt())
                        .build());
    }

    private InventoryDtoWrapper.InventoryDto mapToDto(InventoryItem item) {
        int avail = item.getAvailableQuantity();
        boolean isLow = avail <= (item.getLowStockThreshold() != null ? item.getLowStockThreshold() : 10);

        return InventoryDtoWrapper.InventoryDto.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .variantId(item.getVariantId())
                .productName(item.getProductName())
                .variantName(item.getVariantName())
                .sku(item.getSku())
                .totalQuantity(item.getTotalQuantity())
                .reservedQuantity(item.getReservedQuantity())
                .availableQuantity(avail)
                .lowStockThreshold(item.getLowStockThreshold())
                .isLowStock(isLow)
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
