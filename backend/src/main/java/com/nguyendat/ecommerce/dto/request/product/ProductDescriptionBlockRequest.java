package com.nguyendat.ecommerce.dto.request.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.nguyendat.ecommerce.enums.ProductDescriptionBlockType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDescriptionBlockRequest {
    @NotNull(message = "FIELD_REQUIRED")
    ProductDescriptionBlockType type;

    @Size(max = 200)
    String title;

    String content;

    @Size(max = 500)
    String imageUrl;

    @Size(max = 255)
    String altText;

    @Min(0)
    int sortOrder;

    Boolean active;

    @jakarta.validation.constraints.AssertTrue(message = "IMAGE_URL_REQUIRED")
    public boolean isImageUrlValid() {
        if (type == ProductDescriptionBlockType.IMAGE) {
            return imageUrl != null && !imageUrl.isBlank();
        }
        return true;
    }
}

