package com.ecommerce.product.repository;

import com.ecommerce.common.enums.ProductStatus;
import com.ecommerce.product.dto.ProductFilterCriteria;
import com.ecommerce.product.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterBy(ProductFilterCriteria criteria, boolean customerOnly) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (customerOnly) {
                predicates.add(cb.equal(root.get("status"), ProductStatus.ACTIVE));
            }

            // Keyword search across name, brand, fragranceFamily, notes (F14)
            if (StringUtils.hasText(criteria.getKeyword())) {
                String pattern = "%" + criteria.getKeyword().toLowerCase().trim() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), pattern);
                Predicate brandMatch = cb.like(cb.lower(root.get("brand")), pattern);
                Predicate familyMatch = cb.like(cb.lower(root.get("fragranceFamily")), pattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), pattern);
                Predicate topNotesMatch = cb.like(cb.lower(root.get("topNotes")), pattern);
                Predicate middleNotesMatch = cb.like(cb.lower(root.get("middleNotes")), pattern);
                Predicate baseNotesMatch = cb.like(cb.lower(root.get("baseNotes")), pattern);

                predicates.add(cb.or(nameMatch, brandMatch, familyMatch, descMatch, topNotesMatch, middleNotesMatch, baseNotesMatch));
            }

            // F15: Lọc
            if (StringUtils.hasText(criteria.getBrand())) {
                predicates.add(cb.equal(cb.lower(root.get("brand")), criteria.getBrand().toLowerCase().trim()));
            }

            if (StringUtils.hasText(criteria.getCategory())) {
                predicates.add(cb.equal(cb.lower(root.get("category")), criteria.getCategory().toLowerCase().trim()));
            }

            if (StringUtils.hasText(criteria.getGender())) {
                predicates.add(cb.equal(cb.upper(root.get("gender")), criteria.getGender().toUpperCase().trim()));
            }

            if (StringUtils.hasText(criteria.getFragranceFamily())) {
                predicates.add(cb.equal(cb.lower(root.get("fragranceFamily")), criteria.getFragranceFamily().toLowerCase().trim()));
            }

            if (StringUtils.hasText(criteria.getConcentration())) {
                predicates.add(cb.equal(cb.upper(root.get("concentration")), criteria.getConcentration().toUpperCase().trim()));
            }

            if (criteria.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), criteria.getMinPrice()));
            }

            if (criteria.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), criteria.getMaxPrice()));
            }

            if (criteria.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), criteria.getMinRating()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
