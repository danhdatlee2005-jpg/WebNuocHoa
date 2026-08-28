package com.ecommerce.product.service;

import com.ecommerce.common.exception.BadRequestException;
import com.ecommerce.common.exception.ResourceNotFoundException;
import com.ecommerce.product.dto.CategoryDtoWrapper;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Cacheable(value = "categories", key = "#activeOnly")
    @Transactional(readOnly = true)
    public List<CategoryDtoWrapper.CategoryDto> getAllCategories(boolean activeOnly) {
        List<Category> list = activeOnly ? categoryRepository.findAllByActiveTrue() : categoryRepository.findAll();
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDtoWrapper.CategoryDto getCategoryById(Long id) {
        return mapToDto(categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
    }

    // F62: Thêm Category
    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public CategoryDtoWrapper.CategoryDto createCategory(CategoryDtoWrapper.CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName().trim())) {
            throw new BadRequestException("Category name already exists");
        }
        Category category = Category.builder()
                .name(request.getName().trim())
                .slug(toSlug(request.getName().trim()))
                .description(request.getDescription())
                .parentId(request.getParentId())
                .active(request.isActive())
                .build();
        return mapToDto(categoryRepository.save(category));
    }

    // F62: Sửa Category
    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public CategoryDtoWrapper.CategoryDto updateCategory(Long id, CategoryDtoWrapper.CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        category.setName(request.getName().trim());
        category.setSlug(toSlug(request.getName().trim()));
        category.setDescription(request.getDescription());
        category.setParentId(request.getParentId());
        category.setActive(request.isActive());

        return mapToDto(categoryRepository.save(category));
    }

    // F62: Xóa/Ẩn Category
    @CacheEvict(value = "categories", allEntries = true)
    @Transactional
    public void deleteOrHideCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setActive(false);
        categoryRepository.save(category);
    }

    private String toSlug(String input) {
        String nfdNormalizedString = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfdNormalizedString)
                .replaceAll("")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");
    }

    private CategoryDtoWrapper.CategoryDto mapToDto(Category c) {
        return CategoryDtoWrapper.CategoryDto.builder()
                .id(c.getId())
                .name(c.getName())
                .slug(c.getSlug())
                .description(c.getDescription())
                .parentId(c.getParentId())
                .active(c.isActive())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
