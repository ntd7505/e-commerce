import { useEffect, useState } from "react";
import {
    createCoupon,
    deleteCoupon,
    getDeletedCoupons,
    getCoupons,
    restoreCoupon,
    updateCoupon,
    updateCouponStatus,
} from "../adminCouponApi";
import type { CouponRequest, CouponResponse } from "../adminCouponTypes";

export type CouponViewMode = "ACTIVE" | "DELETED";

export function useAdminCoupons() {
    const [coupons, setCoupons] = useState<CouponResponse[]>([]);
    const [deletedCoupons, setDeletedCoupons] = useState<CouponResponse[]>([]);
    const [viewMode, setViewMode] = useState<CouponViewMode>("ACTIVE");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionCouponId, setActionCouponId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<CouponResponse | null>(null);

    const visibleCoupons = viewMode === "DELETED" ? deletedCoupons : coupons;

    async function refreshCoupons() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            if (viewMode === "DELETED") {
                const data = await getDeletedCoupons();
                setDeletedCoupons(data);
            } else {
                const data = await getCoupons();
                setCoupons(data);
            }
        } catch (error) {
            console.error("Failed to load coupons:", error);
            setError("Khong tai duoc danh sach coupon.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void refreshCoupons();
    }, [viewMode]);

    function openCreateModal() {
        setEditingCoupon(null);
        setError("");
        setMessage("");
        setIsModalOpen(true);
    }

    function openEditModal(coupon: CouponResponse) {
        setEditingCoupon(coupon);
        setError("");
        setMessage("");
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setEditingCoupon(null);
    }

    async function saveCoupon(payload: CouponRequest) {
        try {
            setSaving(true);
            setError("");
            setMessage("");

            if (editingCoupon) {
                const updated = await updateCoupon(editingCoupon.id, payload);

                setCoupons((current) =>
                    current.map((coupon) =>
                        coupon.id === updated.id ? updated : coupon
                    )
                );
                setMessage("Coupon updated successfully.");
            } else {
                const created = await createCoupon(payload);

                setCoupons((current) => [created, ...current]);
                setMessage("Coupon created successfully.");
            }

            closeModal();
        } catch (error) {
            console.error("Failed to save coupon:", error);
            setError("Khong luu duoc coupon.");
        } finally {
            setSaving(false);
        }
    }

    async function toggleCouponStatus(id: number, active: boolean) {
        try {
            setActionCouponId(id);
            setError("");
            setMessage("");

            const updated = await updateCouponStatus(id, active);

            setCoupons((current) =>
                current.map((coupon) =>
                    coupon.id === updated.id ? updated : coupon
                )
            );
            setMessage("Coupon status updated successfully.");
        } catch (error) {
            console.error("Failed to update coupon status:", error);
            setError("Khong cap nhat duoc trang thai coupon.");
        } finally {
            setActionCouponId(null);
        }
    }

    async function removeCoupon(id: number) {
        const confirmed = window.confirm("Ban co chac muon xoa coupon nay khong?");

        if (!confirmed) return;

        try {
            setSaving(true);
            setActionCouponId(id);
            setError("");
            setMessage("");

            await deleteCoupon(id);

            setCoupons((current) => current.filter((coupon) => coupon.id !== id));
            setMessage("Coupon deleted successfully.");
        } catch (error) {
            console.error("Failed to delete coupon:", error);
            setError("Khong xoa duoc coupon.");
        } finally {
            setSaving(false);
            setActionCouponId(null);
        }
    }

    async function restoreDeletedCoupon(id: number) {
        try {
            setActionCouponId(id);
            setError("");
            setMessage("");

            const restored = await restoreCoupon(id);

            setDeletedCoupons((current) => current.filter((coupon) => coupon.id !== id));
            setCoupons((current) => [restored, ...current]);
            setMessage("Coupon restored successfully.");
        } catch (error) {
            console.error("Failed to restore coupon:", error);
            setError("Khong khoi phuc duoc coupon.");
        } finally {
            setActionCouponId(null);
        }
    }

    return {
        coupons: visibleCoupons,
        activeCoupons: coupons,
        deletedCoupons,
        viewMode,
        loading,
        saving,
        actionCouponId,
        error,
        message,
        isModalOpen,
        editingCoupon,

        setViewMode,
        refreshCoupons,
        openCreateModal,
        openEditModal,
        closeModal,
        saveCoupon,
        toggleCouponStatus,
        deleteCoupon: removeCoupon,
        restoreCoupon: restoreDeletedCoupon,
    };
}
