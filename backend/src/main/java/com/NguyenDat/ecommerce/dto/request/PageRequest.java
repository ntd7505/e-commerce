package com.NguyenDat.ecommerce.dto.request;

import java.util.Set;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PageRequest {

    static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "name", "createdAt", "updatedAt");

    @Min(0)
    @Builder.Default
    int page = 0;

    @Min(1)
    @Max(100)
    @Builder.Default
    int size = 10;

    @Builder.Default
    String sortBy = "id";

    @Builder.Default
    String sortDir = "desc";

    public Pageable toPageable() {

        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "id";

        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(safeSortBy).ascending()
                : Sort.by(safeSortBy).descending();

        return org.springframework.data.domain.PageRequest.of(page, size, sort);
    }
}
