package com.nguyendat.ecommerce.repository.specification;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.nguyendat.ecommerce.dto.request.product.ProductFilterRequest;
import com.nguyendat.ecommerce.entity.Product;
import com.nguyendat.ecommerce.entity.ProductVariant;

public final class ProductSpecification {

    private ProductSpecification() {}

    public static Specification<Product> withFilter(ProductFilterRequest filter, boolean clientVisibleOnly) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.isFalse(root.get("deleted")));

            Join<Product, ProductVariant> variants = root.join("variants");

            if (clientVisibleOnly) {
                predicates.add(criteriaBuilder.isTrue(root.get("active")));
                predicates.add(criteriaBuilder.isTrue(variants.get("active")));
            } else if (filter.getActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), filter.getActive()));
                predicates.add(criteriaBuilder.isTrue(variants.get("active")));
                predicates.add(criteriaBuilder.isFalse(variants.get("deleted")));
            }

            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                String keyword = "%" + filter.getKeyword().trim().toLowerCase() + "%";

                Predicate keywordPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("slug")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("shortDescription")), keyword));
                predicates.add(keywordPredicate);
            }

            if (filter.getBrandId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("id"), filter.getBrandId()));
            }

            if (filter.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            if (filter.getMinPrice() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(variants.get("price"), filter.getMinPrice()));
            }

            if (filter.getMaxPrice() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(variants.get("price"), filter.getMaxPrice()));
            }

            query.distinct(true);

            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}

