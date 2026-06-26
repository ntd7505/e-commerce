import { useCallback, useEffect, useMemo, useState } from "react";
import { getOrders } from "../orderApi";
import { ORDER_FILTER_TABS } from "../orderTypes";
import type { Order, OrderTabKey } from "../orderTypes";

export type UseOrdersReturn = {
  orders: Order[];
  filteredOrders: Order[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  activeTab: OrderTabKey;
  search: string;
  loading: boolean;
  error: string;
  setActiveTab: (tab: OrderTabKey) => void;
  setSearch: (value: string) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  refresh: () => void;
};

function matchesSearch(order: Order, keyword: string): boolean {
  const term = keyword.trim().toLowerCase();
  if (term === "") return true;
  if (String(order.id).includes(term)) return true;
  return order.items.some((item) => {
    return (
      item.productName.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term) ||
      item.variantName.toLowerCase().includes(term)
    );
  });
}

export function useOrders(initialSize = 10): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(initialSize);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderTabKey>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getOrders({ page, size, sortBy: "createdAt", sortDir: "desc" });
        if (cancelled) return;
        setOrders(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
        setFirst(data.first);
        setLast(data.last);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load orders:", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [page, size]);

  useEffect(() => {
    const cancel = refresh();
    return cancel;
  }, [refresh]);

  const filteredOrders = useMemo(() => {
    const tabConfig = ORDER_FILTER_TABS.find((tab) => tab.key === activeTab);
    const statuses = tabConfig?.statuses ?? null;
    const byTab =
      statuses === null ? orders : orders.filter((order) => statuses.includes(order.status));
    if (search.trim() === "") return byTab;
    return byTab.filter((order) => matchesSearch(order, search));
  }, [orders, activeTab, search]);

  const goToPage = useCallback((next: number) => {
    setPage(Math.max(0, Math.min(next, Math.max(0, totalPages - 1))));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (!last) setPage((current) => current + 1);
  }, [last]);

  const prevPage = useCallback(() => {
    if (!first) setPage((current) => Math.max(0, current - 1));
  }, [first]);

  return {
    orders,
    filteredOrders,
    page,
    size,
    totalElements,
    totalPages,
    first,
    last,
    activeTab,
    search,
    loading,
    error,
    setActiveTab,
    setSearch,
    goToPage,
    nextPage,
    prevPage,
    refresh,
  };
}
