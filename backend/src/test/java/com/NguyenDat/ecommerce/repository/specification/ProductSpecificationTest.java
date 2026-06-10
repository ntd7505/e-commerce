package com.NguyenDat.ecommerce.repository.specification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.NguyenDat.ecommerce.dto.request.product.ProductFilterRequest;
import com.NguyenDat.ecommerce.entity.Product;

class ProductSpecificationTest {

    Root<Product> root = mock(Root.class);
    CriteriaQuery<?> query = mock(CriteriaQuery.class);
    CriteriaBuilder criteriaBuilder = mock(CriteriaBuilder.class);

    @SuppressWarnings("rawtypes")
    Join variants = mock(Join.class);

    Path<Boolean> deletedPath = mock(Path.class);
    Path<BigDecimal> pricePath = mock(Path.class);
    Predicate predicate = mock(Predicate.class);

    @BeforeEach
    @SuppressWarnings({"unchecked", "rawtypes"})
    void setUp() {
        when(root.get("deleted")).thenReturn((Path) deletedPath);
        when(root.join("variants")).thenReturn(variants);
        when(variants.get("price")).thenReturn((Path) pricePath);
        when(criteriaBuilder.isFalse(deletedPath)).thenReturn(predicate);
        when(criteriaBuilder.and(any(Predicate[].class))).thenReturn(predicate);
    }

    @Test
    void withFilter_shouldAlwaysExcludeDeletedProductsAndUseDistinctResults() {
        ProductFilterRequest filter = new ProductFilterRequest();

        Predicate result = ProductSpecification.withFilter(filter, false).toPredicate(root, query, criteriaBuilder);

        assertEquals(predicate, result);
        verify(criteriaBuilder).isFalse(deletedPath);
        verify(query).distinct(true);
        verify(criteriaBuilder, never()).greaterThanOrEqualTo(pricePath, (BigDecimal) null);
    }

    @Test
    void withFilter_shouldApplyMinimumAndMaximumPrice() {
        BigDecimal minimum = BigDecimal.valueOf(100_000);
        BigDecimal maximum = BigDecimal.valueOf(500_000);
        ProductFilterRequest filter = ProductFilterRequest.builder()
                .minPrice(minimum)
                .maxPrice(maximum)
                .build();
        when(criteriaBuilder.greaterThanOrEqualTo(pricePath, minimum)).thenReturn(predicate);
        when(criteriaBuilder.lessThanOrEqualTo(pricePath, maximum)).thenReturn(predicate);

        ProductSpecification.withFilter(filter, false).toPredicate(root, query, criteriaBuilder);

        verify(criteriaBuilder).greaterThanOrEqualTo(pricePath, minimum);
        verify(criteriaBuilder).lessThanOrEqualTo(pricePath, maximum);
    }
}
