import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useState } from "react";
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

const statusClass: Record<CancelRequestStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-red-50 text-red-600",
};

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
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
                <div>
                    <h3 className="font-bold text-gray-900">Cancel Requests</h3>
                    <p className="mt-1 text-xs font-medium text-gray-500">
                        Showing {filteredRequests.length} of {requests.length} requests
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                        {statusFilters.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setStatusFilter(option.value)}
                                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                    statusFilter === option.value
                                        ? "bg-white text-emerald-700 shadow-sm"
                                        : "text-gray-500 hover:text-gray-800"
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
                            placeholder="Search request, order, reason"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-500"
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {loading && <div className="p-6 text-sm text-gray-500">Loading cancel requests...</div>}
            {!loading && error && <div className="p-6 text-sm font-semibold text-red-600">{error}</div>}
            {!loading && !error && filteredRequests.length === 0 && (
                <div className="p-6 text-sm text-gray-500">No cancel requests found.</div>
            )}

            {!loading && !error && filteredRequests.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
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
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.map((request) => {
                                const busy = actionRequestId === request.id;
                                const pending = request.status === "PENDING";

                                return (
                                    <tr key={request.id}>
                                        <td className="px-5 py-4 font-bold text-gray-900">#{request.id}</td>
                                        <td className="px-5 py-4 font-semibold text-gray-800">#{request.orderId}</td>
                                        <td className="px-5 py-4 text-gray-700">
                                            <p className="max-w-md truncate">{request.reason}</p>
                                            <p className="mt-1 text-xs text-gray-500">Requested by user #{request.requestedBy}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass[request.status]}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{formatDate(request.requestedAt)}</td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(request.reviewedAt)}
                                            {request.reviewedBy && (
                                                <p className="mt-1 text-xs text-gray-500">By admin #{request.reviewedBy}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onAction(request.id, "APPROVE")}
                                                    disabled={!pending || busy}
                                                    className="rounded-md p-2 text-emerald-600 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                    aria-label="Approve cancel request"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onAction(request.id, "REJECT")}
                                                    disabled={!pending || busy}
                                                    className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
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
