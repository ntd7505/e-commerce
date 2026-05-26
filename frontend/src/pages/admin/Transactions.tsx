import { RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminStatCard } from "../../components/AdminStatCard";
import { getOrders } from "../../features/orders/adminOrderApi";
import type { OrderResponse, PaymentStatus } from "../../features/orders/adminOrderTypes";
import { OrderStatusBadge } from "../../features/orders/components/OrderStatusBadge";

type PaymentStatusFilter = "ALL" | PaymentStatus;

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Transactions() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("ALL");

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setError("Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTransactions();
  }, []);

  const transactions = orders.map((order) => ({
    orderId: order.id,
    recipientName: order.recipientName,
    paymentStatus: order.paymentStatus,
    method: order.payment?.method ?? "COD",
    amount: order.payment?.amount ?? order.totalAmount,
    transactionCode: order.payment?.transactionCode ?? "-",
    paidAt: order.payment?.paidAt ?? null,
    createdAt: order.createdAt,
  }));

  const filteredTransactions = transactions.filter((transaction) => {
    const keyword = searchTerm.toLowerCase();
    const matchesKeyword =
      String(transaction.orderId).includes(keyword) ||
      transaction.recipientName.toLowerCase().includes(keyword) ||
      transaction.transactionCode.toLowerCase().includes(keyword);

    if (!matchesKeyword) return false;
    if (statusFilter !== "ALL") return transaction.paymentStatus === statusFilter;
    return true;
  });

  const statusOptions: Array<{ label: string; value: PaymentStatusFilter }> = [
    { label: "All", value: "ALL" },
    { label: "Paid", value: "PAID" },
    { label: "Unpaid", value: "UNPAID" },
    { label: "Failed", value: "FAILED" },
    { label: "Refunded", value: "REFUNDED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          <p className="text-sm text-gray-500">Payment status and transaction references derived from orders.</p>
        </div>
        <button
          type="button"
          onClick={loadTransactions}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Transactions" value={transactions.length} />
        <AdminStatCard label="Paid" value={transactions.filter((item) => item.paymentStatus === "PAID").length} />
        <AdminStatCard label="Unpaid" value={transactions.filter((item) => item.paymentStatus === "UNPAID").length} />
        <AdminStatCard label="Refunded" value={transactions.filter((item) => item.paymentStatus === "REFUNDED").length} />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
          <div>
            <h3 className="font-bold text-gray-900">Payment History</h3>
            <p className="mt-1 text-xs font-medium text-gray-500">
              Showing {filteredTransactions.length} of {transactions.length} records
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                    statusFilter === option.value ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search order, customer, code"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-gray-500">Loading transactions...</div>}
        {!loading && error && <div className="p-6 text-sm font-semibold text-red-600">{error}</div>}
        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="p-6 text-sm text-gray-500">No transactions found.</div>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Method</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Reference</th>
                  <th className="px-5 py-3">Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.orderId}>
                    <td className="px-5 py-4 font-bold text-gray-900">#{transaction.orderId}</td>
                    <td className="px-5 py-4 text-gray-700">{transaction.recipientName}</td>
                    <td className="px-5 py-4 text-gray-700">{transaction.method}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{formatMoney(transaction.amount)}</td>
                    <td className="px-5 py-4"><OrderStatusBadge value={transaction.paymentStatus} /></td>
                    <td className="px-5 py-4 text-gray-600">{transaction.transactionCode}</td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(transaction.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
