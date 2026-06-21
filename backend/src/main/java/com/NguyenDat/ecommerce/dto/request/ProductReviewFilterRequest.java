package com.NguyenDat.ecommerce.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewFilterRequest {

    @Min(0)
    @Builder.Default
    private int page = 0;

    @Min(1)
    @Max(50)
    @Builder.Default
    private int size = 10;

    @Min(1)
    @Max(5)
    private Integer rating;

    private Boolean hasMedia;

    @Pattern(regexp = "(?i)asc|desc")
    @Builder.Default
    private String sortDir = "desc";

    public Pageable toPageable() {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by("createdAt").ascending()
                : Sort.by("createdAt").descending();

        return org.springframework.data.domain.PageRequest.of(page, size, sort);
    }

}
