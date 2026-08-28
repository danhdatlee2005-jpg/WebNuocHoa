package com.ecommerce.product.service;

import com.ecommerce.common.enums.ProductStatus;
import com.ecommerce.common.event.ProductCreatedEvent;
import com.ecommerce.common.event.ProductUpdatedEvent;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.product.dto.*;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.entity.ProductVariant;
import com.ecommerce.product.event.ProductEventPublisher;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.repository.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductEventPublisher productEventPublisher;

    // F12, F14, F15, F16: Xem danh sách, tìm kiếm, lọc, sắp xếp (Customer)
    @Cacheable(value = "customerProducts", key = "#criteria.toString()")
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsCustomer(ProductFilterCriteria criteria) {
        Sort sort = getSort(criteria.getSortBy());
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);
        return productRepository.findAll(ProductSpecification.filterBy(criteria, true), pageable)
                .map(this::mapToDto);
    }

    // F60: Admin xem toàn bộ sản phẩm
    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsAdmin(ProductFilterCriteria criteria) {
        Sort sort = getSort(criteria.getSortBy());
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);
        return productRepository.findAll(ProductSpecification.filterBy(criteria, false), pageable)
                .map(this::mapToDto);
    }

    // F13: Xem chi tiết sản phẩm
    @Cacheable(value = "productDetail", key = "#productId")
    @Transactional(readOnly = true)
    public ProductDto getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        return mapToDto(product);
    }

    // F17, F60: Admin thêm sản phẩm
    @CacheEvict(value = {"customerProducts", "productDetail"}, allEntries = true)
    @Transactional
    public ProductDto createProduct(ProductCreateRequest request) {
        Product product = Product.builder()
                .name(request.getName().trim())
                .brand(request.getBrand().trim())
                .category(request.getCategory().trim())
                .description(request.getDescription())
                .gender(request.getGender())
                .concentration(request.getConcentration())
                .fragranceFamily(request.getFragranceFamily())
                .topNotes(request.getTopNotes())
                .middleNotes(request.getMiddleNotes())
                .baseNotes(request.getBaseNotes())
                .basePrice(request.getBasePrice())
                .promotionalPrice(request.getPromotionalPrice())
                .imageUrl(request.getImageUrl())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .build();

        if (request.getVariants() != null) {
            for (ProductCreateRequest.VariantCreateDto v : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .variantName(v.getVariantName())
                        .volume(v.getVolume())
                        .price(v.getPrice())
                        .promotionalPrice(v.getPromotionalPrice())
                        .sku(v.getSku() != null ? v.getSku() : "SKU-" + System.currentTimeMillis())
                        .active(true)
                        .build();
                product.addVariant(variant);
            }
        }

        Product saved = productRepository.save(product);

        // Publish ProductCreated
        ProductCreatedEvent event = ProductCreatedEvent.builder()
                .productId(saved.getId())
                .name(saved.getName())
                .brand(saved.getBrand())
                .category(saved.getCategory())
                .basePrice(saved.getBasePrice())
                .eventType("ProductCreated")
                .build();
        productEventPublisher.publishProductCreated(event);

        return mapToDto(saved);
    }

    // F18, F60: Admin cập nhật sản phẩm
    @CacheEvict(value = {"customerProducts", "productDetail"}, allEntries = true)
    @Transactional
    public ProductDto updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (request.getName() != null) product.setName(request.getName().trim());
        if (request.getBrand() != null) product.setBrand(request.getBrand().trim());
        if (request.getCategory() != null) product.setCategory(request.getCategory().trim());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getGender() != null) product.setGender(request.getGender());
        if (request.getConcentration() != null) product.setConcentration(request.getConcentration());
        if (request.getFragranceFamily() != null) product.setFragranceFamily(request.getFragranceFamily());
        if (request.getTopNotes() != null) product.setTopNotes(request.getTopNotes());
        if (request.getMiddleNotes() != null) product.setMiddleNotes(request.getMiddleNotes());
        if (request.getBaseNotes() != null) product.setBaseNotes(request.getBaseNotes());
        if (request.getBasePrice() != null) product.setBasePrice(request.getBasePrice());
        if (request.getPromotionalPrice() != null) product.setPromotionalPrice(request.getPromotionalPrice());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getImages() != null) product.setImages(request.getImages());
        if (request.getStatus() != null) product.setStatus(request.getStatus());

        Product saved = productRepository.save(product);

        // Publish ProductUpdated
        ProductUpdatedEvent event = ProductUpdatedEvent.builder()
                .productId(saved.getId())
                .name(saved.getName())
                .basePrice(saved.getBasePrice())
                .status(saved.getStatus().name())
                .eventType("ProductUpdated")
                .build();
        productEventPublisher.publishProductUpdated(event);

        return mapToDto(saved);
    }

    // F19: Admin thay đổi trạng thái (ACTIVE, INACTIVE, DISCONTINUED)
    @CacheEvict(value = {"customerProducts", "productDetail"}, allEntries = true)
    @Transactional
    public ProductDto updateProductStatus(Long productId, ProductStatus status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setStatus(status);
        Product saved = productRepository.save(product);

        ProductUpdatedEvent event = ProductUpdatedEvent.builder()
                .productId(saved.getId())
                .name(saved.getName())
                .basePrice(saved.getBasePrice())
                .status(saved.getStatus().name())
                .eventType("ProductUpdated")
                .build();
        productEventPublisher.publishProductUpdated(event);

        return mapToDto(saved);
    }

    @CacheEvict(value = {"customerProducts", "productDetail"}, allEntries = true)
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            product.getVariants().clear();
            productRepository.saveAndFlush(product);
        }

        productRepository.delete(product);
        productRepository.flush();
    }

    // F16: Sắp xếp
    private Sort getSort(String sortBy) {
        if (sortBy == null) return Sort.by("createdAt").descending();
        return switch (sortBy) {
            case "priceAsc" -> Sort.by("basePrice").ascending();
            case "priceDesc" -> Sort.by("basePrice").descending();
            case "ratingDesc" -> Sort.by("rating").descending();
            case "bestSeller" -> Sort.by("soldCount").descending();
            case "nameAsc" -> Sort.by("name").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }

    public ProductDto mapToDto(Product product) {
        List<ProductVariantDto> variantDtos = product.getVariants().stream()
                .map(v -> ProductVariantDto.builder()
                        .id(v.getId())
                        .productId(product.getId())
                        .variantName(v.getVariantName())
                        .volume(v.getVolume())
                        .price(v.getPrice())
                        .promotionalPrice(v.getPromotionalPrice())
                        .sku(v.getSku())
                        .active(v.isActive())
                        .build())
                .collect(Collectors.toList());

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .brand(product.getBrand())
                .category(product.getCategory())
                .description(product.getDescription())
                .gender(product.getGender())
                .concentration(product.getConcentration())
                .fragranceFamily(product.getFragranceFamily())
                .topNotes(product.getTopNotes())
                .middleNotes(product.getMiddleNotes())
                .baseNotes(product.getBaseNotes())
                .basePrice(product.getBasePrice())
                .promotionalPrice(product.getPromotionalPrice())
                .imageUrl(product.getImageUrl())
                .images(product.getImages())
                .rating(product.getRating())
                .totalReviews(product.getTotalReviews())
                .soldCount(product.getSoldCount())
                .status(product.getStatus())
                .variants(variantDtos)
                .createdAt(product.getCreatedAt())
                .build();
    }
}
