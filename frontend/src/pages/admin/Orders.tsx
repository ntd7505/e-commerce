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

      <OrderStats orders={ordersPage.orders} />

      <div className="flex w-fit rounded-lg border border-border-strong bg-surface p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "ORDERS"}
          onClick={() => setActiveTab("ORDERS")}
          className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
            activeTab === "ORDERS"
              ? "bg-surface text-success shadow-sm"
              : "text-muted hover:text-text"
          }`}
        >
          Orders
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "CANCEL_REQUESTS"}
          onClick={() => setActiveTab("CANCEL_REQUESTS")}
          className={`rounded-md px-4 py-2 text-sm font-bold transition-colors ${
            activeTab === "CANCEL_REQUESTS"
              ? "bg-surface text-success shadow-sm"
              : "text-muted hover:text-text"
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
