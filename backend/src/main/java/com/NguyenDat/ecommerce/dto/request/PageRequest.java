package com.NguyenDat.ecommerce.dto.request;

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
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        return org.springframework.data.domain.PageRequest.of(page, size, sort);
    }
}
