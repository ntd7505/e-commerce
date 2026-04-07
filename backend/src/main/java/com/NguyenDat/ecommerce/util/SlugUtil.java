package com.NguyenDat.ecommerce.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtil {
    private SlugUtil() {}

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Input cannot be null");
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String slug = normalized
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "")
                .replaceAll("-{2,}", "-");

        if (slug.isBlank()) {
            throw new IllegalArgumentException("Generated slug is blank");
        }
        return slug;
    }

    public static String toUniqueSlug(String input, java.util.function.Predicate<String> existsChecker) {
        String baseSlug = toSlug(input);
        String candidate = baseSlug;
        int counter = 1;
        while (existsChecker.test(candidate)) {
            candidate = baseSlug + "-" + counter;
            counter++;
        }
        return candidate;
    }
}
