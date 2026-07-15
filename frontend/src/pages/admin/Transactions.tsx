import { Download, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { getPayments, updatePaymentStatus, type PaymentResponse } from "../../features/admin/transactions/adminPaymentApi";
import { OrderStatusBadge } from "../../features/admin/orders/components/OrderStatusBadge";
import { Modal } from "../../components/common";
import { useToast } from "../../features/ui/ToastProvider";
import { Button } from "../../components/common";

type PaymentStatusFilter = "ALL" | PaymentResponse["status"];

const PAGE_SIZE = 15;

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

function exportToCsv(rows: PaymentResponse[], filename: string) {
  const headers = ["ID", "Order ID", "Method", "Amount (VND)", "Status", "Reference", "Paid At"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        `#${r.orderId}`,
        r.method,
        r.amount,
        r.status,
        r.transactionCode || "-",
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

export default function Transactions() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");
      const data = await getPayments({ size: 1000 }); // Getting all for client side filtering for now
      setPayments(data?.content ?? []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setError("Không thể tải danh sách giao dịch.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial load
    void loadTransactions();
  }, []);

  const filteredTransactions = payments.filter((payment) => {
    const keyword = searchTerm.toLowerCase();
    const matchesKeyword =
      String(payment.orderId).includes(keyword) ||
      String(payment.id).includes(keyword) ||
      (payment.transactionCode || "").toLowerCase().includes(keyword);
    if (!matchesKeyword) return false;
    if (statusFilter !== "ALL") return payment.status === statusFilter;
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

  const handleUpdateStatus = async (status: string) => {
    if (!selectedPayment) return;
    try {
      setUpdating(true);
      await updatePaymentStatus(selectedPayment.id, status);
      await loadTransactions();
      setSelectedPayment(null);
      showToast("Đã cập nhật trạng thái giao dịch.", "success");
    } catch (error) {
      console.error("Failed to update payment status:", error);
      showToast("Không thể cập nhật trạng thái.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const statusOptions: Array<{ label: string; value: PaymentStatusFilter }> = [
    { label: "Tất cả", value: "ALL" },
    { label: "Đã TT", value: "PAID" },
    { label: "Chưa TT", value: "UNPAID" },
    { label: "Thất bại", value: "FAILED" },
    { label: "Hoàn tiền", value: "REFUNDED" },
    { label: "Đã hủy", value: "CANCELLED" },
  ];

  const paidCount = payments.filter((t) => t.status === "PAID").length;
  const unpaidCount = payments.filter((t) => t.status === "UNPAID").length;
  const refundedCount = payments.filter((t) => t.status === "REFUNDED").length;
  const totalRevenue = payments
    .filter((t) => t.status === "PAID")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text">Giao dịch</h2>
          <p className="text-sm text-muted">Quản lý thanh toán và giao dịch.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!payments || payments.length === 0}
            onClick={() =>
              exportToCsv(filteredTransactions, `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
            }
            className="flex items-center gap-2 rounded-lg border border-success-soft bg-success-soft px-4 py-2 text-sm font-bold text-success transition-colors hover:bg-success-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Xuất CSV
          </button>
          <button
            type="button"
            onClick={loadTransactions}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Tải lại
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <AdminStatCard label="Tổng cộng" value={payments.length} />
        <AdminStatCard label="Đã TT" value={paidCount} />
        <AdminStatCard label="Chưa TT" value={unpaidCount} />
        <AdminStatCard label="Doanh thu" value={`${formatMoney(totalRevenue)} đ`} />
        <div className="hidden">
          <AdminStatCard label="Hoàn tiền" value={refundedCount} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
          <div>
            <h3 className="font-bold text-text">Lịch sử giao dịch</h3>
            <p className="mt-1 text-xs font-medium text-muted">
              Hiển thị {filteredTransactions.length}/{payments.length} bản ghi
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
                placeholder="Tìm mã đơn, mã tham chiếu"
                className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-success focus:ring-1 focus:ring-success"
              />
            </div>
          </div>
        </div>

        {loading && <div className="p-6 text-sm text-muted">Đang tải dữ liệu...</div>}
        {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
        {!loading && !error && filteredTransactions.length === 0 && (
          <div className="p-10 text-center">
            <Download className="mx-auto mb-3 h-10 w-10 text-subtle" />
            <p className="text-sm font-semibold text-muted">Chưa có giao dịch nào</p>
          </div>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="sticky top-0 bg-surface text-xs font-semibold text-muted">
                  <tr>
                    <th className="px-5 py-3 font-bold">Mã GD</th>
                    <th className="px-5 py-3 font-bold">Mã đơn</th>
                    <th className="px-5 py-3 font-bold">Phương thức</th>
                    <th className="px-5 py-3 font-bold text-right">Số tiền</th>
                    <th className="px-5 py-3 font-bold">Trạng thái</th>
                    <th className="px-5 py-3 font-bold">Tham chiếu</th>
                    <th className="px-5 py-3 font-bold">Ngày thanh toán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagedTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className="cursor-pointer transition-colors hover:bg-surface-alt"
                      onClick={() => setSelectedPayment(transaction)}
                    >
                      <td className="px-5 py-4 font-bold text-text">#{transaction.id}</td>
                      <td className="px-5 py-4 font-bold text-text">#{transaction.orderId}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-md bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted">
                          {transaction.method}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-text">
                        {formatMoney(transaction.amount)} đ
                      </td>
                      <td className="px-5 py-4">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <OrderStatusBadge value={transaction.status as any} />
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted">{transaction.transactionCode || "-"}</td>
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
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}-
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
                          <span className="px-1 text-muted">...</span>
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

      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Chi tiết giao dịch"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted">Mã đơn</p>
                <p className="font-semibold text-text">#{selectedPayment.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Số tiền</p>
                <p className="font-semibold text-text">{formatMoney(selectedPayment.amount)} đ</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Phương thức</p>
                <p className="font-semibold text-text">{selectedPayment.method}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Trạng thái</p>
                <div className="mt-1">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <OrderStatusBadge value={selectedPayment.status as any} />
                </div>
              </div>
            </div>

            {selectedPayment.method === "BANK_TRANSFER" && (
              <div className="rounded-xl border border-border p-4 bg-surface-alt">
                <h4 className="font-bold text-text mb-2">Chi tiết chuyển khoản</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-muted">Mã GD:</p>
                  <p className="font-medium text-text">{selectedPayment.transactionCode}</p>
                  <p className="text-muted">Ngân hàng:</p>
                  <p className="font-medium text-text">{selectedPayment.bankCode || "-"}</p>
                  <p className="text-muted">Tài khoản:</p>
                  <p className="font-medium text-text">{selectedPayment.bankAccount || "-"}</p>
                  <p className="text-muted">Tên TK:</p>
                  <p className="font-medium text-text">{selectedPayment.bankAccountName || "-"}</p>
                  <p className="text-muted">Nội dung:</p>
                  <p className="font-medium text-text">{selectedPayment.transferContent || "-"}</p>
                </div>
                {selectedPayment.qrCodeUrl && (
                  <div className="mt-4 flex justify-center">
                    <img src={selectedPayment.qrCodeUrl} alt="QR Code" className="w-48 h-48 rounded-lg border border-border" />
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-border flex justify-end gap-2">
              {selectedPayment.status === "UNPAID" && (
                <Button 
                  variant="success" 
                  onClick={() => handleUpdateStatus("PAID")}
                  loading={updating}
                >
                  Đánh dấu Đã thanh toán
                </Button>
              )}
              {selectedPayment.status === "PAID" && (
                <Button 
                  variant="danger" 
                  onClick={() => handleUpdateStatus("REFUNDED")}
                  loading={updating}
                >
                  Đánh dấu Đã hoàn tiền
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

