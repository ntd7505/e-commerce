package com.NguyenDat.ecommerce.repository.specification;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import com.NguyenDat.ecommerce.entity.ProductReview;

public final class ProductReviewSpecification {
    public static Specification<ProductReview> filter(Long productId, Integer rating, Boolean hasMedia) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("product").get("id"), productId));
            predicates.add(cb.isFalse(root.get("deleted")));
            predicates.add(cb.isTrue(root.get("active")));

            if (rating != null) {
                predicates.add(cb.equal(root.get("rating"), rating));
            }

            if (Boolean.TRUE.equals(hasMedia)) {
                predicates.add(cb.isNotEmpty(root.get("media")));
            } else if (Boolean.FALSE.equals(hasMedia)) {
                predicates.add(cb.isEmpty(root.get("media")));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private ProductReviewSpecification() {}
}
