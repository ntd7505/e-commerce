import { ShoppingCart } from "lucide-react";
import { AdminEmptyState } from "../../components/AdminEmptyState";

export default function Orders() {
  return (
    <AdminEmptyState
      icon={ShoppingCart}
      title="Order management needs backend endpoints"
      description="Frontend không còn hiển thị mock order data. Khi backend có API orders, page này nên nối danh sách đơn, trạng thái xử lý, chi tiết đơn, refund và fulfillment."
    />
  );
}
