import { useCallback, useEffect, useState } from "react";
import {
  cancelOrder,
  confirmReceipt,
  getOrderById,
  requestCancelOrder,
} from "../orderApi";
import type { Order } from "../orderTypes";

export type DetailAction = "CANCEL" | "CANCEL_REQUEST" | "RECEIPT";

export type UseOrderDetailReturn = {
  order: Order | null;
  loading: boolean;
  error: string;
  actionLoading: boolean;
  refetch: () => void;
  cancel: (reason: string) => Promise<boolean>;
  requestCancel: (reason: string) => Promise<boolean>;
  confirmReceived: () => Promise<boolean>;
};

export function useOrderDetail(orderId: number | string | undefined): UseOrderDetailReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const refetch = useCallback(() => {
    if (orderId === undefined || orderId === null || orderId === "") {
      setLoading(false);
      setError("Không tìm thấy mã đơn hàng.");
      return;
    }
    const resolvedId: string | number = orderId;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getOrderById(resolvedId);
        if (cancelled) return;
        setOrder(data);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load order detail:", err);
        setError("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const cancel = refetch();
    return cancel;
  }, [refetch]);

  const cancel = useCallback(
    async (reason: string): Promise<boolean> => {
      if (!order) return false;
      try {
        setActionLoading(true);
        const updated = await cancelOrder(order.id, reason);
        setOrder(updated);
        return true;
      } catch (err) {
        console.error("Failed to cancel order:", err);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [order],
  );

  const requestCancel = useCallback(
    async (reason: string): Promise<boolean> => {
      if (!order) return false;
      try {
        setActionLoading(true);
        const updated = await requestCancelOrder(order.id, reason);
        setOrder(updated);
        return true;
      } catch (err) {
        console.error("Failed to request cancel order:", err);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [order],
  );

  const confirmReceived = useCallback(async (): Promise<boolean> => {
    if (!order) return false;
    try {
      setActionLoading(true);
      const updated = await confirmReceipt(order.id);
      setOrder(updated);
      return true;
    } catch (err) {
      console.error("Failed to confirm receipt:", err);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [order]);

  return {
    order,
    loading,
    error,
    actionLoading,
    refetch,
    cancel,
    requestCancel,
    confirmReceived,
  };
}
