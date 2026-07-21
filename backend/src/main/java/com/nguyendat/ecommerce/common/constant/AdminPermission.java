package com.nguyendat.ecommerce.common.constant;

import java.util.Set;

public final class AdminPermission {

    public static final String PRODUCT_MANAGE = "PRODUCT_MANAGE";
    public static final String BRAND_MANAGE = "BRAND_MANAGE";
    public static final String COUPON_MANAGE = "COUPON_MANAGE";
    public static final String ORDER_MANAGE = "ORDER_MANAGE";
    public static final String USER_MANAGE = "USER_MANAGE";

    public static final Set<String> ALL =
            Set.of(PRODUCT_MANAGE, BRAND_MANAGE, COUPON_MANAGE, ORDER_MANAGE, USER_MANAGE);
    public static final Set<String> STAFF = Set.of(PRODUCT_MANAGE, BRAND_MANAGE, COUPON_MANAGE, ORDER_MANAGE);

    public static final String PRODUCT_ACCESS = "hasRole('ADMIN') or hasAuthority('PRODUCT_MANAGE')";
    public static final String BRAND_ACCESS = "hasRole('ADMIN') or hasAuthority('BRAND_MANAGE')";
    public static final String COUPON_ACCESS = "hasRole('ADMIN') or hasAuthority('COUPON_MANAGE')";
    public static final String ORDER_ACCESS = "hasRole('ADMIN') or hasAuthority('ORDER_MANAGE')";
    public static final String USER_ACCESS = "hasRole('ADMIN') or hasAuthority('USER_MANAGE')";
    public static final String ADMIN_ONLY = "hasRole('ADMIN')";

    private AdminPermission() {}
}

