import { useEffect, useState } from "react";
import {
    approveOrderCancelRequest,
    getOrderCancelRequests,
    rejectOrderCancelRequest,
} from "../adminOrderCancelApi";
import type { OrderCancelRequestResponse } from "../adminOrderCancelTypes";

type CancelRequestAction = "APPROVE" | "REJECT";

export function useAdminOrderCancelRequests() {
    const [requests, setRequests] = useState<OrderCancelRequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionRequestId, setActionRequestId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function refreshRequests() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

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
            setMessage("");

            const updated =
                action === "APPROVE"
                    ? await approveOrderCancelRequest(requestId)
                    : await rejectOrderCancelRequest(requestId);

            setRequests((current) =>
                current.map((request) =>
                    request.id === updated.id ? updated : request
                )
            );
            setMessage(`Cancel request #${updated.id} ${action === "APPROVE" ? "approved" : "rejected"}.`);
        } catch (error) {
            console.error("Failed to update order cancel request:", error);
            setError("Could not update order cancel request.");
        } finally {
            setActionRequestId(null);
        }
    }

    return {
        requests,
        loading,
        actionRequestId,
        error,
        message,
        refreshRequests,
        runCancelRequestAction,
    };
}
