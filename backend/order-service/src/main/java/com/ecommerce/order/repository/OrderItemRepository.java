package com.ecommerce.order.repository;

import com.ecommerce.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findAllByOrderId(Long orderId);

    // Kiểm tra khách hàng đã mua sản phẩm và đơn đã DELIVERED hay chưa để cho phép review (F47)
    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi JOIN oi.order o WHERE o.customerId = :customerId AND oi.productId = :productId AND o.orderStatus = 'DELIVERED'")
    boolean hasPurchasedAndDelivered(Long customerId, Long productId);
}
