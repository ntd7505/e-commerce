import { useState } from "react";
import { AdminAlert } from "../../components/admin/AdminAlert";
import { OrderDetailModal } from "../../features/admin/orders/components/OrderDetailModal";
import { OrderCancelRequestsTable } from "../../features/admin/orders/components/OrderCancelRequestsTable";
import { OrderStats } from "../../features/admin/orders/components/OrderStats";
import { OrdersHeader } from "../../features/admin/orders/components/OrdersHeader";
import { OrdersTable } from "../../features/admin/orders/components/OrdersTable";
import { useAdminOrderCancelRequests } from "../../features/admin/orders/hooks/useAdminOrderCancelRequests";
import { useAdminOrders } from "../../features/admin/orders/hooks/useAdminOrders";

type OrdersPageTab = "ORDERS" | "CANCEL_REQUESTS";

export default function Orders() {
  const ordersPage = useAdminOrders();
  const cancelRequestsPage = useAdminOrderCancelRequests();
  const [activeTab, setActiveTab] = useState<OrdersPageTab>("ORDERS");

  const loading = activeTab === "ORDERS" ? ordersPage.loading : cancelRequestsPage.loading;

  function refreshActiveTab() {
    if (activeTab === "ORDERS") {
      void ordersPage.refreshOrders();
      return;
    }

    void cancelRequestsPage.refreshRequests();
  }

  return (
    <div className="space-y-6">
      <OrdersHeader
        loading={loading}
        onRefresh={refreshActiveTab}
      />

      {ordersPage.message && (
        <AdminAlert tone="success">{ordersPage.message}</AdminAlert>
      )}

      {cancelRequestsPage.message && (
        <AdminAlert tone="success">{cancelRequestsPage.message}</AdminAlert>
      )}

      <OrderStats orders={ordersPage.orders} />

      <div className="flex w-fit rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("ORDERS")}
          className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
            activeTab === "ORDERS"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("CANCEL_REQUESTS")}
          className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
            activeTab === "CANCEL_REQUESTS"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Cancel Requests
        </button>
      </div>

      {activeTab === "ORDERS" ? (
        <OrdersTable
          orders={ordersPage.orders}
          loading={ordersPage.loading}
          error={ordersPage.error}
          actionOrderId={ordersPage.actionOrderId}
          onView={ordersPage.openOrderDetail}
          onAction={ordersPage.runOrderAction}
        />
      ) : (
        <OrderCancelRequestsTable
          requests={cancelRequestsPage.requests}
          loading={cancelRequestsPage.loading}
          error={cancelRequestsPage.error}
          actionRequestId={cancelRequestsPage.actionRequestId}
          onAction={cancelRequestsPage.runCancelRequestAction}
        />
      )}

      <OrderDetailModal
        order={ordersPage.selectedOrder}
        loading={ordersPage.loadingDetail}
        actionOrderId={ordersPage.actionOrderId}
        onClose={ordersPage.closeOrderDetail}
        onAction={ordersPage.runOrderAction}
      />
    </div>
  );
}
