package com.ecommerce.inventory.config;

import com.ecommerce.inventory.entity.InventoryItem;
import com.ecommerce.inventory.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InventoryDataInitializer implements CommandLineRunner {

    private final InventoryItemRepository inventoryItemRepository;

    @Override
    public void run(String... args) {
        if (inventoryItemRepository.count() == 0) {
            // Seed stock for the 5 initialized products
            inventoryItemRepository.save(InventoryItem.builder().productId(1L).variantId(1L).productName("Dior Sauvage Eau de Parfum").variantName("60ml").sku("DIOR-SAUVAGE-60ML").totalQuantity(50).reservedQuantity(0).lowStockThreshold(5).build());
            inventoryItemRepository.save(InventoryItem.builder().productId(1L).variantId(2L).productName("Dior Sauvage Eau de Parfum").variantName("100ml").sku("DIOR-SAUVAGE-100ML").totalQuantity(80).reservedQuantity(0).lowStockThreshold(5).build());

            inventoryItemRepository.save(InventoryItem.builder().productId(2L).variantId(3L).productName("Bleu de Chanel Eau de Parfum").variantName("50ml").sku("CHANEL-BLEU-50ML").totalQuantity(45).reservedQuantity(0).lowStockThreshold(5).build());
            inventoryItemRepository.save(InventoryItem.builder().productId(2L).variantId(4L).productName("Bleu de Chanel Eau de Parfum").variantName("100ml").sku("CHANEL-BLEU-100ML").totalQuantity(60).reservedQuantity(0).lowStockThreshold(5).build());

            inventoryItemRepository.save(InventoryItem.builder().productId(3L).variantId(5L).productName("Tom Ford Black Orchid").variantName("50ml").sku("TF-BLACKORCHID-50ML").totalQuantity(30).reservedQuantity(0).lowStockThreshold(5).build());
            inventoryItemRepository.save(InventoryItem.builder().productId(3L).variantId(6L).productName("Tom Ford Black Orchid").variantName("100ml").sku("TF-BLACKORCHID-100ML").totalQuantity(40).reservedQuantity(0).lowStockThreshold(5).build());

            inventoryItemRepository.save(InventoryItem.builder().productId(4L).variantId(7L).productName("YSL Libre Eau de Parfum").variantName("50ml").sku("YSL-LIBRE-50ML").totalQuantity(70).reservedQuantity(0).lowStockThreshold(8).build());
            inventoryItemRepository.save(InventoryItem.builder().productId(4L).variantId(8L).productName("YSL Libre Eau de Parfum").variantName("90ml").sku("YSL-LIBRE-90ML").totalQuantity(55).reservedQuantity(0).lowStockThreshold(8).build());

            inventoryItemRepository.save(InventoryItem.builder().productId(5L).variantId(9L).productName("Le Labo Santal 33").variantName("50ml").sku("LELABO-SANTAL33-50ML").totalQuantity(25).reservedQuantity(0).lowStockThreshold(5).build());
            inventoryItemRepository.save(InventoryItem.builder().productId(5L).variantId(10L).productName("Le Labo Santal 33").variantName("100ml").sku("LELABO-SANTAL33-100ML").totalQuantity(20).reservedQuantity(0).lowStockThreshold(5).build());
            log.info("Initialized inventory stock for all products.");
        }
    }
}
