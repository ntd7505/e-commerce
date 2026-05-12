package com.NguyenDat.ecommerce.dto.response.product_review;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReviewSummaryResponse {
    Double averageRating;
    Long totalReviews;

    Long fiveStarCount;
    Long fourStarCount;
    Long threeStarCount;
    Long twoStarCount;
    Long oneStarCount;

    Double fiveStarPercent;
    Double fourStarPercent;
    Double threeStarPercent;
    Double twoStarPercent;
    Double oneStarPercent;
}
