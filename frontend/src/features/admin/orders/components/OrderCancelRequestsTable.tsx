import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge, Button } from "../../../../components/common";
import type { CancelRequestStatus, OrderCancelRequestResponse } from "../adminOrderCancelTypes";

type OrderCancelRequestsTableProps = {
    requests: OrderCancelRequestResponse[];
    loading: boolean;
    error: string;
    actionRequestId: number | null;
    onAction: (requestId: number, action: "APPROVE" | "REJECT") => void;
};

const statusFilters: Array<{ label: string; value: "ALL" | CancelRequestStatus }> = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Chấp nhận", value: "APPROVED" },
    { label: "Từ chối", value: "REJECTED" },
];

function formatDate(value: string | null) {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function OrderCancelRequestsTable({
    requests,
    loading,
    error,
    actionRequestId,
    onAction,
}: OrderCancelRequestsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | CancelRequestStatus>("ALL");

    const filteredRequests = requests.filter((request) => {
        const keyword = searchTerm.toLowerCase();
        const matchesKeyword =
            String(request.id).includes(keyword) ||
            String(request.orderId).includes(keyword) ||
            request.reason.toLowerCase().includes(keyword);

        if (!matchesKeyword) {
            return false;
        }

        if (statusFilter !== "ALL") {
            return request.status === statusFilter;
        }

        return true;
    });

    const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "ALL";

    function clearFilters() {
        setSearchTerm("");
        setStatusFilter("ALL");
    }

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-5">
                <div>
                    <h3 className="font-bold text-text">Yêu cầu hủy đơn</h3>
                    <p className="mt-1 text-xs font-semibold text-muted">
                        Hiển thị {filteredRequests.length} trong số {requests.length} yêu cầu
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-border-strong bg-surface p-1 shadow-inner">
                        {statusFilters.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setStatusFilter(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                                    statusFilter === option.value
                                        ? "bg-surface-alt text-primary shadow-sm"
                                        : "text-muted hover:text-text"
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
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tìm yêu cầu, mã đơn, lý do..."
                            className="w-full rounded-lg border border-border-strong bg-surface py-2.5 pl-9 pr-3 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={clearFilters}
                        >
                            Xóa lọc
                        </Button>
                    )}
                </div>
            </div>

            {loading && <div className="p-6 text-sm font-semibold text-muted">Đang tải danh sách...</div>}
            {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
            {!loading && !error && filteredRequests.length === 0 && (
                <div className="p-6 text-sm font-semibold text-muted">Không tìm thấy yêu cầu hủy đơn nào.</div>
            )}

            {!loading && !error && filteredRequests.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="bg-surface-alt text-xs font-bold uppercase tracking-wider text-muted border-b border-border">
                            <tr>
                                <th className="px-5 py-3">Mã yêu cầu</th>
                                <th className="px-5 py-3">Mã đơn</th>
                                <th className="px-5 py-3">Lý do</th>
                                <th className="px-5 py-3">Trạng thái</th>
                                <th className="px-5 py-3">Ngày gửi</th>
                                <th className="px-5 py-3">Ngày xử lý</th>
                                <th className="px-5 py-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredRequests.map((request) => {
                                const busy = actionRequestId === request.id;
                                const pending = request.status === "PENDING";

                                return (
                                    <tr key={request.id}>
                                        <td className="px-5 py-4 font-bold text-text">#{request.id}</td>
                                        <td className="px-5 py-4 font-semibold text-text">#{request.orderId}</td>
                                        <td className="px-5 py-4 text-text">
                                            <p className="max-w-md truncate font-medium">{request.reason}</p>
                                            <p className="mt-1 text-xs text-muted">Gửi bởi user #{request.requestedBy}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Badge variant={request.status === "PENDING" ? "warning" : request.status === "APPROVED" ? "success" : "danger"}>
                                                {request.status === "PENDING" ? "Chờ xử lý" : request.status === "APPROVED" ? "Chấp nhận" : "Từ chối"}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-4 text-muted">{formatDate(request.requestedAt)}</td>
                                        <td className="px-5 py-4 text-muted">
                                            {formatDate(request.reviewedAt)}
                                            {request.reviewedBy && (
                                                <p className="mt-1 text-xs text-muted">Bởi admin #{request.reviewedBy}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => onAction(request.id, "APPROVE")}
                                                    disabled={!pending || busy}
                                                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                                                    title="Chấp nhận hủy đơn"
                                                />
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => onAction(request.id, "REJECT")}
                                                    disabled={!pending || busy}
                                                    leftIcon={<XCircle className="h-4 w-4" />}
                                                    title="Từ chối hủy đơn"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
