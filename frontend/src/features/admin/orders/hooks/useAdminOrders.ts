import { useEffect, useState } from "react";
import {
    confirmOrder,
    deliverOrder,
    getOrderById,
    getOrders,
    processOrder,
    shipOrder,
} from "../adminOrderApi";
import type { OrderResponse } from "../adminOrderTypes";

type OrderAction = "CONFIRM" | "PROCESS" | "SHIP" | "DELIVER";

export function useAdminOrders() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [actionOrderId, setActionOrderId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function refreshOrders() {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
            setError("Could not load orders.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void refreshOrders();
    }, []);

    function syncOrder(updated: OrderResponse) {
        setOrders((current) =>
            current.map((order) => (order.id === updated.id ? updated : order))
        );
        setSelectedOrder((current) =>
            current && current.id === updated.id ? updated : current
        );
    }

    async function openOrderDetail(orderId: number) {
        try {
            setLoadingDetail(true);
            setError("");

            const data = await getOrderById(orderId);
            setSelectedOrder(data);
            syncOrder(data);
        } catch (error) {
            console.error("Failed to load order detail:", error);
            setError("Could not load order detail.");
        } finally {
            setLoadingDetail(false);
        }
    }

    function closeOrderDetail() {
        setSelectedOrder(null);
    }

    async function runOrderAction(orderId: number, action: OrderAction) {
        try {
            setActionOrderId(orderId);
            setError("");
            setMessage("");

            const updated =
                action === "CONFIRM"
                    ? await confirmOrder(orderId)
                    : action === "PROCESS"
                      ? await processOrder(orderId)
                      : action === "SHIP"
                        ? await shipOrder(orderId)
                        : await deliverOrder(orderId);

            syncOrder(updated);
            setMessage(`Order #${updated.id} updated successfully.`);
        } catch (error) {
            console.error("Failed to update order:", error);
            setError("Could not update order.");
        } finally {
            setActionOrderId(null);
        }
    }

    return {
        orders,
        selectedOrder,
        loading,
        loadingDetail,
        actionOrderId,
        error,
        message,
        refreshOrders,
        openOrderDetail,
        closeOrderDetail,
        runOrderAction,
    };
}
