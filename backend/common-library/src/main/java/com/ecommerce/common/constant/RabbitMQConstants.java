package com.ecommerce.common.constant;

public final class RabbitMQConstants {
    private RabbitMQConstants() {}

    // Exchange
    public static final String TOPIC_EXCHANGE = "ecommerce.topic.exchange";

    // Queues
    public static final String AUTH_USER_QUEUE = "auth.user.queue";
    public static final String NOTIFICATION_QUEUE = "notification.general.queue";
    public static final String INVENTORY_ORDER_QUEUE = "inventory.order.queue";
    public static final String PAYMENT_ORDER_QUEUE = "payment.order.queue";
    public static final String ORDER_SAGA_QUEUE = "order.saga.queue";
    public static final String SHIPPING_ORDER_QUEUE = "shipping.order.queue";
    public static final String REVIEW_ORDER_QUEUE = "review.order.queue";
    public static final String ADMIN_ANALYTICS_QUEUE = "admin.analytics.queue";

    // Routing Keys
    // Auth
    public static final String RK_USER_REGISTERED = "user.registered";
    public static final String RK_USER_UPDATED = "user.updated";
    public static final String RK_USER_BLOCKED = "user.blocked";
    public static final String RK_USER_UNBLOCKED = "user.unblocked";
    public static final String RK_PASSWORD_RESET_REQUESTED = "user.password_reset";

    // Product
    public static final String RK_PRODUCT_CREATED = "product.created";
    public static final String RK_PRODUCT_UPDATED = "product.updated";
    public static final String RK_PRODUCT_ACTIVATED = "product.activated";
    public static final String RK_PRODUCT_DEACTIVATED = "product.deactivated";

    // Order
    public static final String RK_ORDER_CREATED = "order.created";
    public static final String RK_ORDER_CONFIRMED = "order.confirmed";
    public static final String RK_ORDER_CANCELLED = "order.cancelled";
    public static final String RK_ORDER_EXPIRED = "order.expired";
    public static final String RK_ORDER_DELIVERED = "order.delivered";

    // Inventory
    public static final String RK_INVENTORY_RESERVED = "inventory.reserved";
    public static final String RK_INVENTORY_RESERVATION_FAILED = "inventory.reservation_failed";
    public static final String RK_INVENTORY_RELEASED = "inventory.released";
    public static final String RK_INVENTORY_INCREASED = "inventory.increased";
    public static final String RK_INVENTORY_DECREASED = "inventory.decreased";

    // Payment
    public static final String RK_PAYMENT_INITIATED = "payment.initiated";
    public static final String RK_PAYMENT_COMPLETED = "payment.completed";
    public static final String RK_PAYMENT_FAILED = "payment.failed";
    public static final String RK_PAYMENT_REFUNDED = "payment.refunded";

    // Shipping
    public static final String RK_SHIPMENT_CREATED = "shipment.created";
    public static final String RK_SHIPMENT_PICKED_UP = "shipment.picked_up";
    public static final String RK_SHIPMENT_IN_TRANSIT = "shipment.in_transit";
    public static final String RK_SHIPMENT_DELIVERED = "shipment.delivered";
    public static final String RK_SHIPMENT_FAILED = "shipment.failed";

    // Review
    public static final String RK_REVIEW_CREATED = "review.created";
    public static final String RK_REVIEW_UPDATED = "review.updated";
    public static final String RK_REVIEW_DELETED = "review.deleted";
}
