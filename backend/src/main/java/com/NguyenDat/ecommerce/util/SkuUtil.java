package com.NguyenDat.ecommerce.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.function.Predicate;

public class SkuUtil {

    private SkuUtil() {}

    public static String toSkuToken(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Input cannot be null or blank");
        }

        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String token = normalized
                .toUpperCase(Locale.ROOT)
                .replaceAll("[^A-Z0-9]+", "-")
                .replaceAll("^-+|-+$", "")
                .replaceAll("-{2,}", "-");

        if (token.isBlank()) {
            throw new IllegalArgumentException("Generated SKU token is blank");
        }

        return token;
    }

    public static String toUniqueSku(String productName, String variantName, Predicate<String> existsChecker) {
        String baseSku = toSkuToken(productName) + "-" + toSkuToken(variantName);
        String candidate = baseSku;
        int counter = 1;

        while (existsChecker.test(candidate)) {
            candidate = baseSku + "-" + counter;
            counter++;
        }

        return candidate;
    }
}
