package com.nguyendat.ecommerce.dto.response;

import lombok.Builder;

@Builder
public record ProductReviewEligibilityResponse(boolean eligible, Long orderItemId, String reason) {}

