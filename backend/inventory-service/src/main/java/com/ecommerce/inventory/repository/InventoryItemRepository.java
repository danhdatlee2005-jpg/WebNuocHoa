package com.ecommerce.inventory.repository;

import com.ecommerce.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findByProductIdAndVariantId(Long productId, Long variantId);
    Optional<InventoryItem> findFirstByProductId(Long productId);
    List<InventoryItem> findAllByProductId(Long productId);

    // Cảnh báo sản phẩm sắp hết (F59)
    @Query("SELECT i FROM InventoryItem i WHERE (i.totalQuantity - i.reservedQuantity) <= i.lowStockThreshold")
    List<InventoryItem> findLowStockItems();
}
