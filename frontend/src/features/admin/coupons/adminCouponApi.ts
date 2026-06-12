import { adminClient } from "../../../api/adminClient";
import { unwrapApiList, type ApiResponse } from "../../../types/api";
import type { CouponRequest, CouponResponse } from "./adminCouponTypes";

export async function getCoupons(): Promise<CouponResponse[]> {
    const response = await adminClient.get<ApiResponse<CouponResponse[]>>(
        "/api/v1/admin/coupons/all"
    );
    return unwrapApiList(response.data.data);
}

export async function getDeletedCoupons(): Promise<CouponResponse[]> {
    const response = await adminClient.get<ApiResponse<CouponResponse[]>>(
        "/api/v1/admin/coupons/deleted/all"
    );
    return unwrapApiList(response.data.data);
}

export async function createCoupon(payload: CouponRequest): Promise<CouponResponse> {
    const response = await adminClient.post<ApiResponse<CouponResponse>>(
        '/api/v1/admin/coupons',
        payload
    )
    return response.data.data;
}

export async function updateCoupon(id: number, payload: CouponRequest): Promise<CouponResponse> {
    const response = await adminClient.patch<ApiResponse<CouponResponse>>(
        `/api/v1/admin/coupons/${id}`,
        payload
    );
    return response.data.data;
}

export async function updateCouponStatus(id: number, active: boolean): Promise<CouponResponse> {
    const response = await adminClient.patch<ApiResponse<CouponResponse>>(
        `/api/v1/admin/coupons/${id}/status`,
        { active }
    );

    return response.data.data;
}

export async function deleteCoupon(id: number): Promise<void> {
    await adminClient.delete(`/api/v1/admin/coupons/${id}`);
}

export async function restoreCoupon(id: number): Promise<CouponResponse> {
    const response = await adminClient.patch<ApiResponse<CouponResponse>>(
        `/api/v1/admin/coupons/${id}/restore`
    );

    return response.data.data;
}
