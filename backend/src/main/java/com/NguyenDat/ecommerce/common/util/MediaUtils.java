package com.NguyenDat.ecommerce.common.util;

import com.NguyenDat.ecommerce.entity.ProductMedia;

import java.util.List;
import java.util.Comparator;

public class MediaUtils {
    
    private MediaUtils() {
        throw new IllegalStateException("Utility class");
    }

    public static String resolveThumbnailUrl(List<ProductMedia> media) {
        if (media == null || media.isEmpty()) {
            return null;
        }

        return media.stream()
                .filter(m -> m != null && m.isActive() && !m.isDeleted())
                .sorted((left, right) -> {
                    if (left.isThumbnail() != right.isThumbnail()) {
                        return left.isThumbnail() ? -1 : 1;
                    }
                    return Integer.compare(left.getSortOrder(), right.getSortOrder());
                })
                .map(ProductMedia::getUrl)
                .findFirst()
                .orElse(null);
    }
}
