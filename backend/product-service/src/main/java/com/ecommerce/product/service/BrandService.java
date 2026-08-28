package com.ecommerce.product.service;

import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.product.dto.BrandDtoWrapper;
import com.ecommerce.product.entity.Brand;
import com.ecommerce.product.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    @Cacheable(value = "brands", key = "#activeOnly")
    @Transactional(readOnly = true)
    public List<BrandDtoWrapper.BrandDto> getAllBrands(boolean activeOnly) {
        List<Brand> list = activeOnly ? brandRepository.findAllByActiveTrue() : brandRepository.findAll();
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BrandDtoWrapper.BrandDto getBrandById(Long id) {
        return mapToDto(brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found")));
    }

    // F61: Thêm Brand
    @CacheEvict(value = "brands", allEntries = true)
    @Transactional
    public BrandDtoWrapper.BrandDto createBrand(BrandDtoWrapper.BrandRequest request) {
        if (brandRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Brand with name already exists");
        }
        Brand brand = Brand.builder()
                .name(request.getName().trim())
                .country(request.getCountry())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .active(request.isActive())
                .build();
        return mapToDto(brandRepository.save(brand));
    }

    // F61: Sửa Brand
    @CacheEvict(value = "brands", allEntries = true)
    @Transactional
    public BrandDtoWrapper.BrandDto updateBrand(Long id, BrandDtoWrapper.BrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        brand.setName(request.getName().trim());
        brand.setCountry(request.getCountry());
        brand.setDescription(request.getDescription());
        brand.setLogoUrl(request.getLogoUrl());
        brand.setActive(request.isActive());

        return mapToDto(brandRepository.save(brand));
    }

    // F61: Ẩn/Hiện Brand
    @CacheEvict(value = "brands", allEntries = true)
    @Transactional
    public BrandDtoWrapper.BrandDto toggleBrandStatus(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));
        brand.setActive(!brand.isActive());
        return mapToDto(brandRepository.save(brand));
    }

    private BrandDtoWrapper.BrandDto mapToDto(Brand b) {
        return BrandDtoWrapper.BrandDto.builder()
                .id(b.getId())
                .name(b.getName())
                .country(b.getCountry())
                .description(b.getDescription())
                .logoUrl(b.getLogoUrl())
                .active(b.isActive())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
