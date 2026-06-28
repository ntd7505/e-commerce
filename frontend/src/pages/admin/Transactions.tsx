import { Download, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { getOrders } from "../../features/admin/orders/adminOrderApi";
import type { OrderResponse, PaymentStatus } from "../../features/admin/orders/adminOrderTypes";
import { OrderStatusBadge } from "../../features/admin/orders/components/OrderStatusBadge";

type PaymentStatusFilter = "ALL" | PaymentStatus;

const PAGE_SIZE = 15;

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportToCsv(rows: ReturnType<typeof mapTransactions>, filename: string) {
  const headers = ["Order ID", "Customer", "Method", "Amount (VND)", "Status", "Reference", "Paid At"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `#${r.orderId}`,
        `"${r.recipientName}"`,
        r.method,
        r.amount,
        r.paymentStatus,
        r.transactionCode,
        r.paidAt ? formatDate(r.paidAt) : "",
      ].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function mapTransactions(orders: OrderResponse[]) {
  return orders.map((order) => ({
    orderId: order.id,
    recipientName: order.recipientName,
    paymentStatus: order.paymentStatus,
    method: order.payment?.method ?? "COD",
    amount: order.payment?.amount ?? order.totalAmount,
    transactionCode: order.payment?.transactionCode ?? "—",
    paidAt: order.payment?.paidAt ?? null,
    createdAt: order.createdAt,
  }));
}

export default function Transactions() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("ALL");
  const [page, setPage] = useState(1);

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
    const timer = setTimeout(() => {
      void loadTransactions();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const transactions = mapTransactions(orders);

  const filteredTransactions = transactions.filter((transaction) => {
    const keyword = searchTerm.toLowerCase();
    const matchesKeyword =
      String(transaction.orderId).includes(keyword) ||
      (transaction.recipientName || "").toLowerCase().includes(keyword) ||
      (transaction.transactionCode || "").toLowerCase().includes(keyword);
    if (!matchesKeyword) return false;
    if (statusFilter !== "ALL") return transaction.paymentStatus === statusFilter;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedTransactions = filteredTransactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSearch(value: string) {
    setSearchTerm(value);
    setPage(1);
  }
  function handleFilter(value: PaymentStatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  const statusOptions: Array<{ label: string; value: PaymentStatusFilter }> = [
    { label: "All", value: "ALL" },
    { label: "Paid", value: "PAID" },
    { label: "Unpaid", value: "UNPAID" },
    { label: "Failed", value: "FAILED" },
    { label: "Refunded", value: "REFUNDED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const paidCount = transactions.filter((t) => t.paymentStatus === "PAID").length;
  const unpaidCount = transactions.filter((t) => t.paymentStatus === "UNPAID").length;
  const refundedCount = transactions.filter((t) => t.paymentStatus === "REFUNDED").length;
  const totalRevenue = transactions
    .filter((t) => t.paymentStatus === "PAID")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text">Transactions</h2>
          <p className="text-sm text-muted">Payment status and transaction references derived from orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              exportToCsv(filteredTransactions, `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
            }
            className="flex items-center gap-2 rounded-lg border border-success-soft bg-success-soft px-4 py-2 text-sm font-bold text-success transition-colors hover:bg-success-soft"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={loadTransactions}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Total" value={transactions.length} />
        <AdminStatCard label="Paid" value={paidCount} />
        <AdminStatCard label="Unpaid" value={unpaidCount} />
        <AdminStatCard label="Revenue" value={`${formatMoney(totalRevenue)} ?`} />
        <div className="hidden">
          <AdminStatCard label="Refunded" value={refundedCount} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
          <div>
            <h3 className="font-bold text-text">Payment History</h3>
            <p className="mt-1 text-xs font-medium text-muted">
              Showing {filteredTransactions.length} of {transactions.length} records
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-lg border border-border-strong bg-surface p-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilter(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${statusFilter === option.value ? "bg-surface text-success shadow-sm" : "text-muted hover:text-text"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search order, customer, code"
                className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-success focus:ring-1 focus:ring-success"
              />
            </div>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-muted">Loading transactions...</div>}
        {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="p-10 text-center">
            <Download className="mx-auto mb-3 h-10 w-10 text-subtle" />
            <p className="text-sm font-semibold text-muted">No transactions found</p>
          </div>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="sticky top-0 bg-surface text-xs font-semibold text-muted">
                  <tr>
                    <th className="px-5 py-3 font-bold">Order</th>
                    <th className="px-5 py-3 font-bold">Customer</th>
                    <th className="px-5 py-3 font-bold">Method</th>
                    <th className="px-5 py-3 font-bold text-right">Amount</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Reference</th>
                    <th className="px-5 py-3 font-bold">Paid At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagedTransactions.map((transaction) => (
                    <tr key={transaction.orderId} className="transition-colors hover:bg-surface">
                      <td className="px-5 py-4 font-bold text-text">#{transaction.orderId}</td>
                      <td className="px-5 py-4 font-medium text-text">{transaction.recipientName}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted">
                          {transaction.method}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-text">
                        {formatMoney(transaction.amount)} ?
                      </td>
                      <td className="px-5 py-4">
                        <OrderStatusBadge value={transaction.paymentStatus} />
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted">{transaction.transactionCode}</td>
                      <td className="px-5 py-4 text-muted">{formatDate(transaction.paidAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <p className="text-xs text-muted">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-md border border-border-strong p-1.5 text-muted transition-colors hover:bg-surface disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, idx, arr) => (
                      <span key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-muted">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setPage(p)}
                          className={`min-w-[32px] rounded-md border px-2 py-1 text-xs font-bold transition-colors ${p === currentPage
                              ? "border-success bg-success text-white"
                              : "border-border-strong text-muted hover:bg-surface"
                            }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-md border border-border-strong p-1.5 text-muted transition-colors hover:bg-surface disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
