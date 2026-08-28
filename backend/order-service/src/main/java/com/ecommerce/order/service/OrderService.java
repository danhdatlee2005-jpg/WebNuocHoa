package com.ecommerce.order.service;

import com.ecommerce.common.enums.OrderStatus;
import com.ecommerce.common.enums.PaymentStatus;
import com.ecommerce.common.event.OrderCancelledEvent;
import com.ecommerce.common.event.OrderConfirmedEvent;
import com.ecommerce.common.event.OrderCreatedEvent;
import com.ecommerce.common.event.OrderDeliveredEvent;
import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ForbiddenException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.order.dto.CheckoutRequest;
import com.ecommerce.order.dto.OrderDto;
import com.ecommerce.order.dto.OrderStatusUpdateRequest;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.event.OrderEventPublisher;
import com.ecommerce.order.repository.OrderItemRepository;
import com.ecommerce.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderEventPublisher orderEventPublisher;

    // F28, F29: Checkout & Tạo đơn hàng (Snapshotting giá, tên, địa chỉ, status: PENDING)
    @Transactional
    public OrderDto checkout(Long customerId, CheckoutRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderCreatedEvent.OrderItemEventDto> itemEventDtos = new ArrayList<>();

        for (CheckoutRequest.CheckoutItemDto itemDto : request.getItems()) {
            BigDecimal itemSubtotal = itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(itemSubtotal);

            OrderItem orderItem = OrderItem.builder()
                    .productId(itemDto.getProductId())
                    .variantId(itemDto.getVariantId())
                    .productName(itemDto.getProductName())
                    .variantName(itemDto.getVariantName())
                    .imageUrl(itemDto.getImageUrl())
                    .unitPrice(itemDto.getUnitPrice())
                    .quantity(itemDto.getQuantity())
                    .subtotal(itemSubtotal)
                    .build();
            orderItems.add(orderItem);

            itemEventDtos.add(OrderCreatedEvent.OrderItemEventDto.builder()
                    .productId(itemDto.getProductId())
                    .variantId(itemDto.getVariantId())
                    .productName(itemDto.getProductName())
                    .variantName(itemDto.getVariantName())
                    .unitPrice(itemDto.getUnitPrice())
                    .quantity(itemDto.getQuantity())
                    .subtotal(itemSubtotal)
                    .build());
        }

        BigDecimal discount = request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO;
        BigDecimal shippingFee = request.getShippingFee() != null ? request.getShippingFee() : BigDecimal.ZERO;
        BigDecimal total = subtotal.subtract(discount).add(shippingFee);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        PaymentStatus initialPaymentStatus = "COD".equalsIgnoreCase(request.getPaymentMethod())
                ? PaymentStatus.PENDING
                : PaymentStatus.PENDING;

        Order order = Order.builder()
                .customerId(customerId)
                .customerEmail(request.getCustomerEmail())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingMethod(request.getShippingMethod() != null ? request.getShippingMethod() : "STANDARD")
                .subtotal(subtotal)
                .discountAmount(discount)
                .shippingFee(shippingFee)
                .totalAmount(total)
                .promotionCode(request.getPromotionCode())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "COD")
                .paymentStatus(initialPaymentStatus)
                .orderStatus(OrderStatus.PENDING)
                .notes(request.getNotes())
                .items(new ArrayList<>())
                .build();

        for (OrderItem item : orderItems) {
            order.addItem(item);
        }

        Order savedOrder = orderRepository.save(order);

        // Publish OrderCreated event to trigger Saga (Inventory & Payment)
        OrderCreatedEvent event = OrderCreatedEvent.builder()
                .orderId(savedOrder.getId())
                .customerId(savedOrder.getCustomerId())
                .customerEmail(savedOrder.getCustomerEmail())
                .customerName(savedOrder.getCustomerName())
                .subtotal(savedOrder.getSubtotal())
                .discountAmount(savedOrder.getDiscountAmount())
                .shippingFee(savedOrder.getShippingFee())
                .totalAmount(savedOrder.getTotalAmount())
                .shippingAddress(savedOrder.getShippingAddress())
                .paymentMethod(savedOrder.getPaymentMethod())
                .promotionCode(savedOrder.getPromotionCode())
                .items(itemEventDtos)
                .eventType("OrderCreated")
                .build();

        orderEventPublisher.publishOrderCreated(event);

        return mapToDto(savedOrder);
    }

    // F30: Lịch sử đơn hàng
    @Transactional(readOnly = true)
    public Page<OrderDto> getCustomerOrders(Long customerId, Pageable pageable) {
        return orderRepository.findAllByCustomerId(customerId, pageable).map(this::mapToDto);
    }

    // F31: Chi tiết đơn hàng
    @Transactional(readOnly = true)
    public OrderDto getOrderDetail(Long customerId, Long orderId) {
        Order order;
        if (customerId != null) {
            order = orderRepository.findByIdAndCustomerId(orderId, customerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        } else {
            order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        }
        return mapToDto(order);
    }

    // F32: Hủy đơn hàng (Chỉ hủy được khi PENDING hoặc CONFIRMED)
    @Transactional
    public OrderDto cancelOrder(Long customerId, Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getCustomerId().equals(customerId)) {
            throw new ForbiddenException("You can only cancel your own order");
        }

        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled in current status: " + order.getOrderStatus());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);

        // Publish OrderCancelled to trigger stock release and customer notification
        OrderCancelledEvent event = OrderCancelledEvent.builder()
                .orderId(saved.getId())
                .customerId(saved.getCustomerId())
                .reason(reason != null ? reason : "Cancelled by customer")
                .eventType("OrderCancelled")
                .build();
        orderEventPublisher.publishOrderCancelled(event);

        return mapToDto(saved);
    }

    // F58: Admin xem toàn bộ đơn hàng
    @Transactional(readOnly = true)
    public Page<OrderDto> getAllOrdersAdmin(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findAllByOrderStatus(status, pageable).map(this::mapToDto);
        }
        return orderRepository.findAll(pageable).map(this::mapToDto);
    }

    // F58: Admin cập nhật trạng thái đơn hàng (Confirm, Processing, Cancel, Ship, Complete)
    @Transactional
    public OrderDto updateOrderStatusAdmin(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (request.getOrderStatus() != null) {
            order.setOrderStatus(request.getOrderStatus());

            if (request.getOrderStatus() == OrderStatus.CONFIRMED) {
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
            } else if (request.getOrderStatus() == OrderStatus.DELIVERED) {
                orderEventPublisher.publishOrderDelivered(OrderDeliveredEvent.builder()
                        .orderId(order.getId())
                        .customerId(order.getCustomerId())
                        .eventType("OrderDelivered")
                        .build());
            } else if (request.getOrderStatus() == OrderStatus.CANCELLED) {
                orderEventPublisher.publishOrderCancelled(OrderCancelledEvent.builder()
                        .orderId(order.getId())
                        .customerId(order.getCustomerId())
                        .reason("Cancelled by administrator")
                        .eventType("OrderCancelled")
                        .build());
            }
        }

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(request.getPaymentStatus());
        }
        if (request.getTrackingNumber() != null) {
            order.setTrackingNumber(request.getTrackingNumber());
        }
        if (request.getNotes() != null) {
            order.setNotes(request.getNotes());
        }

        Order saved = orderRepository.save(order);
        return mapToDto(saved);
    }

    // Kiểm tra quyền đánh giá (F47)
    @Transactional(readOnly = true)
    public boolean checkPurchasedAndDelivered(Long customerId, Long productId) {
        return orderItemRepository.hasPurchasedAndDelivered(customerId, productId);
    }

    public OrderDto mapToDto(Order order) {
        List<OrderDto.OrderItemDto> items = order.getItems().stream()
                .map(i -> OrderDto.OrderItemDto.builder()
                        .id(i.getId())
                        .productId(i.getProductId())
                        .variantId(i.getVariantId())
                        .productName(i.getProductName())
                        .variantName(i.getVariantName())
                        .imageUrl(i.getImageUrl())
                        .unitPrice(i.getUnitPrice())
                        .quantity(i.getQuantity())
                        .subtotal(i.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .customerId(order.getCustomerId())
                .customerEmail(order.getCustomerEmail())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingMethod(order.getShippingMethod())
                .trackingNumber(order.getTrackingNumber())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .promotionCode(order.getPromotionCode())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .notes(order.getNotes())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
