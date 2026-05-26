import { AdminAlert } from "../../components/AdminAlert";
import { CouponHeader } from "../../features/coupon/components/CouponHeader";
import { useAdminCoupons } from "../../features/coupon/hook/useAdminCoupons";
import { CouponStats } from "../../features/coupon/components/CouponStats";
import { CouponTable } from "../../features/coupon/components/CouponTable";
import { CouponModal } from "../../features/coupon/components/CouponModal";
export default function Coupons() {
  const couponsPage = useAdminCoupons();

  return (
    <div className="space-y-6">
      <CouponHeader
        loading={couponsPage.loading}
        onRefresh={couponsPage.refreshCoupons}
        onAdd={couponsPage.openCreateModal}
      />

      {couponsPage.message && (
        <AdminAlert tone="success">{couponsPage.message}</AdminAlert>
      )}

      <CouponStats
        coupons={couponsPage.activeCoupons}
      />

      <CouponTable
        coupons={couponsPage.coupons}
        loading={couponsPage.loading}
        error={couponsPage.error}
        viewMode={couponsPage.viewMode}
        actionCouponId={couponsPage.actionCouponId}
        onViewModeChange={couponsPage.setViewMode}
        onEdit={couponsPage.openEditModal}
        onDelete={couponsPage.deleteCoupon}
        onRestore={couponsPage.restoreCoupon}
        onToggleStatus={couponsPage.toggleCouponStatus}
      />

      <CouponModal
        open={couponsPage.isModalOpen}
        saving={couponsPage.saving}
        editingCoupon={couponsPage.editingCoupon}
        onClose={couponsPage.closeModal}
        onSubmit={couponsPage.saveCoupon}
      />
    </div>
  );
}
