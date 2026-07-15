import { useEffect, useState } from "react";
import {
    approveOrderCancelRequest,
    getOrderCancelRequests,
    rejectOrderCancelRequest,
} from "../adminOrderCancelApi";
import type { OrderCancelRequestResponse } from "../adminOrderCancelTypes";
import { useToast } from "../../../../features/ui/ToastProvider";

type CancelRequestAction = "APPROVE" | "REJECT";

export function useAdminOrderCancelRequests() {
    const [requests, setRequests] = useState<OrderCancelRequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionRequestId, setActionRequestId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const { showToast } = useToast();

    async function refreshRequests() {
        try {
            setLoading(true);
            setError("");

            const data = await getOrderCancelRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load order cancel requests:", error);
            setError("Could not load order cancel requests.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshRequests();
    }, []);

    async function runCancelRequestAction(requestId: number, action: CancelRequestAction) {
        try {
            setActionRequestId(requestId);
            setError("");

            const updated =
                action === "APPROVE"
                    ? await approveOrderCancelRequest(requestId)
                    : await rejectOrderCancelRequest(requestId);

            setRequests((current) =>
                current.map((request) =>
                    request.id === updated.id ? updated : request
                )
            );
            showToast(`Yêu cầu hủy đơn #${updated.id} đã được ${action === "APPROVE" ? "chấp thuận" : "từ chối"}.`, "success");
        } catch (error) {
            console.error("Failed to update order cancel request:", error);
            showToast("Không thể cập nhật yêu cầu hủy đơn.", "error");
        } finally {
            setActionRequestId(null);
        }
    }

    return {
        requests,
        loading,
        actionRequestId,
        error,
        refreshRequests,
        runCancelRequestAction,
    };
}
