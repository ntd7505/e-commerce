import { Download, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminStatCard } from "../../components/admin/AdminStatCard";
import { getPayments, updatePaymentStatus, type PaymentResponse } from "../../features/admin/transactions/adminPaymentApi";
import { OrderStatusBadge } from "../../features/admin/orders/components/OrderStatusBadge";
import { Modal, Button, Badge } from "../../components/common";
import { useToast } from "../../features/ui/ToastProvider";

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
      const data = await getPayments({ size: 1000 });
      setPayments(data?.content ?? []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setError("Không thể tải danh sách giao dịch.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  const totalRevenue = payments
    .filter((t) => t.status === "PAID")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight">Giao dịch</h2>
          <p className="text-sm text-muted mt-1">Quản lý thanh toán và đối soát.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            disabled={!payments || payments.length === 0}
            onClick={() => exportToCsv(filteredTransactions, `transactions_${new Date().toISOString().slice(0, 10)}.csv`)}
          >
            Xuất CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
            onClick={loadTransactions}
            disabled={loading}
          >
            Tải lại
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Tổng cộng" value={payments.length} />
        <AdminStatCard label="Đã thanh toán" value={paidCount} />
        <AdminStatCard label="Chưa thanh toán" value={unpaidCount} />
        <AdminStatCard label="Doanh thu" value={`${formatMoney(totalRevenue)} đ`} />
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="border-b border-border p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface">
          <div className="flex flex-wrap gap-1.5">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => { setStatusFilter(option.value); setPage(1); }}
                className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  statusFilter === option.value
                    ? "bg-primary-soft text-primary shadow-sm"
                    : "text-muted hover:bg-surface-alt hover:text-text"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Tìm mã đơn, mã tham chiếu..."
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted">
            <RefreshCw className="h-8 w-8 animate-spin mb-4 text-border-strong" />
            <span className="text-sm font-medium">Đang tải dữ liệu...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-semibold text-danger">{error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-muted">
            <Search className="h-10 w-10 mb-4 text-border-strong" />
            <p className="text-sm font-semibold text-text">Không tìm thấy giao dịch nào</p>
            <p className="text-xs mt-1 text-muted">Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-alt text-xs font-semibold text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Mã GD</th>
                  <th className="px-5 py-3">Mã đơn</th>
                  <th className="px-5 py-3">Phương thức</th>
                  <th className="px-5 py-3 text-right">Số tiền</th>
                  <th className="px-5 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Tham chiếu</th>
                  <th className="px-5 py-3">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pagedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="cursor-pointer transition-colors hover:bg-surface-alt group"
                    onClick={() => setSelectedPayment(tx)}
                  >
                    <td className="px-5 py-4 font-semibold text-text">#{tx.id}</td>
                    <td className="px-5 py-4 text-muted group-hover:text-text transition-colors">#{tx.orderId}</td>
                    <td className="px-5 py-4">
                      <Badge variant="neutral" size="sm">{tx.method}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-text">
                      {formatMoney(tx.amount)} đ
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusBadge value={tx.status as any} />
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted truncate max-w-[120px]">{tx.transactionCode || "-"}</td>
                    <td className="px-5 py-4 text-muted text-xs">{formatDate(tx.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-surface">
            <span className="text-xs font-medium text-muted">
              \u00A0
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="flex items-center px-2 text-sm font-semibold text-text min-w-[3rem] justify-center">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Chi tiết giao dịch"
      >
        {selectedPayment && (
          <div className="space-y-6">
            {/* Core Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-surface-alt p-5 rounded-xl border border-border">
              <div>
                <p className="text-xs font-semibold text-muted mb-1 uppercase tracking-wider">Mã đơn</p>
                <p className="font-bold text-text text-base">#{selectedPayment.orderId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted mb-1 uppercase tracking-wider">Số tiền</p>
                <p className="font-bold text-primary text-base">{formatMoney(selectedPayment.amount)} đ</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted mb-1 uppercase tracking-wider">Phương thức</p>
                <Badge variant="neutral" size="sm">{selectedPayment.method}</Badge>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted mb-1 uppercase tracking-wider">Trạng thái</p>
                <div className="mt-1">
                  <OrderStatusBadge value={selectedPayment.status as any} />
                </div>
              </div>
            </div>

            {/* Transfer Detail Block */}
            {selectedPayment.method === "BANK_TRANSFER" && (
              <div className="rounded-xl border border-border p-5 space-y-3 bg-surface text-sm">
                <h4 className="font-bold text-text border-b border-border pb-2 mb-3">Thông tin chuyển khoản</h4>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Mã tham chiếu:</span>
                  <span className="font-semibold text-text font-mono bg-surface-alt px-2 py-0.5 rounded text-xs">{selectedPayment.transactionCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Ngân hàng:</span>
                  <span className="font-medium text-text">{selectedPayment.bankCode || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Tài khoản:</span>
                  <span className="font-medium text-text">{selectedPayment.bankAccount || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Tên tài khoản:</span>
                  <span className="font-medium text-text">{selectedPayment.bankAccountName || "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Nội dung:</span>
                  <span className="font-medium text-text">{selectedPayment.transferContent || "-"}</span>
                </div>
                
                {selectedPayment.qrCodeUrl && (
                  <div className="mt-5 flex flex-col items-center border-t border-border pt-5">
                    <span className="text-xs font-medium text-muted mb-3">Mã QR Thanh Toán</span>
                    <img src={selectedPayment.qrCodeUrl} alt="QR" className="w-40 h-40 rounded-xl border border-border p-2 bg-white" />
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              {selectedPayment.status === "UNPAID" && (
                <Button 
                  variant="success" 
                  onClick={() => handleUpdateStatus("PAID")}
                  loading={updating}
                  fullWidth
                >
                  Xác nhận Đã thanh toán
                </Button>
              )}
              {selectedPayment.status === "PAID" && (
                <Button 
                  variant="danger" 
                  onClick={() => handleUpdateStatus("REFUNDED")}
                  loading={updating}
                  fullWidth
                >
                  Đánh dấu Hoàn tiền
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
