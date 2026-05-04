import { Ticket } from "lucide-react";
import { AdminEmptyState } from "../../components/AdminEmptyState";

export default function Coupons() {
  return (
    <AdminEmptyState
      icon={Ticket}
      title="Coupon management is waiting for backend APIs"
      description="Sidebar route đã có trang ổn định, nhưng backend hiện chưa expose coupon endpoints. Khi có API coupons, page này có thể nối CRUD, validation và campaign rules."
    />
  );
}
