import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { AdminBadge } from "../../../../components/admin/AdminBadge";
import { badgeVariantForStatus } from "../../../../utils/badgeUtils";
import type { CancelRequestStatus, OrderCancelRequestResponse } from "../adminOrderCancelTypes";

type OrderCancelRequestsTableProps = {
    requests: OrderCancelRequestResponse[];
    loading: boolean;
    error: string;
    actionRequestId: number | null;
    onAction: (requestId: number, action: "APPROVE" | "REJECT") => void;
};

const statusFilters: Array<{ label: string; value: "ALL" | CancelRequestStatus }> = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
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
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
                <div>
                    <h3 className="font-bold text-text">Cancel Requests</h3>
                    <p className="mt-1 text-xs font-medium text-muted">
                        Showing {filteredRequests.length} of {requests.length} requests
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-border-strong bg-surface p-1">
                        {statusFilters.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setStatusFilter(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                    statusFilter === option.value
                                        ? "bg-surface text-success shadow-sm"
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
                            placeholder="Search request, order, reason"
                            className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-success"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-muted transition-colors hover:bg-surface"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {loading && <div className="p-6 text-sm text-muted">Loading cancel requests...</div>}
            {!loading && error && <div className="p-6 text-sm font-semibold text-danger">{error}</div>}
            {!loading && !error && filteredRequests.length === 0 && (
                <div className="p-6 text-sm text-muted">No cancel requests found.</div>
            )}

            {!loading && !error && filteredRequests.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="bg-surface text-xs uppercase text-muted">
                            <tr>
                                <th className="px-5 py-3">Request</th>
                                <th className="px-5 py-3">Order</th>
                                <th className="px-5 py-3">Reason</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3">Requested</th>
                                <th className="px-5 py-3">Reviewed</th>
                                <th className="px-5 py-3 text-right">Actions</th>
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
                                            <p className="max-w-md truncate">{request.reason}</p>
                                            <p className="mt-1 text-xs text-muted">Requested by user #{request.requestedBy}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <AdminBadge variant={badgeVariantForStatus(request.status)}>
                                                {request.status}
                                            </AdminBadge>
                                        </td>
                                        <td className="px-5 py-4 text-muted">{formatDate(request.requestedAt)}</td>
                                        <td className="px-5 py-4 text-muted">
                                            {formatDate(request.reviewedAt)}
                                            {request.reviewedBy && (
                                                <p className="mt-1 text-xs text-muted">By admin #{request.reviewedBy}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onAction(request.id, "APPROVE")}
                                                    disabled={!pending || busy}
                                                    className="rounded-md p-2 text-success transition-colors hover:bg-success-soft disabled:cursor-not-allowed disabled:opacity-40"
                                                    aria-label="Approve cancel request"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onAction(request.id, "REJECT")}
                                                    disabled={!pending || busy}
                                                    className="rounded-md p-2 text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-40"
                                                    aria-label="Reject cancel request"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
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
