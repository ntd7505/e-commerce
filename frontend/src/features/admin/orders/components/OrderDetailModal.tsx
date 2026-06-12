import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { OrderResponse } from "../adminOrderTypes";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OrderDetailModalProps = {
    order: OrderResponse | null;
    loading: boolean;
    actionOrderId: number | null;
    onClose: () => void;
    onAction: (orderId: number, action: "CONFIRM" | "PROCESS" | "SHIP" | "DELIVER") => void;
};

function formatMoney(value: number) {
    return value.toLocaleString("vi-VN");
}

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

function getNextAction(order: OrderResponse): { label: string; action: "CONFIRM" | "PROCESS" | "SHIP" | "DELIVER" } | null {
    if (order.status === "PENDING") {
        return { label: "Confirm order", action: "CONFIRM" };
    }

    if (order.status === "CONFIRMED") {
        return { label: "Move to processing", action: "PROCESS" };
    }

    if (order.status === "PROCESSING") {
        return { label: "Ship order", action: "SHIP" };
    }

    if (order.status === "SHIPPING") {
        return { label: "Mark delivered", action: "DELIVER" };
    }

    return null;
}

export function OrderDetailModal({
    order,
    loading,
    actionOrderId,
    onClose,
    onAction,
}: OrderDetailModalProps) {
    if (!order && !loading) {
        return null;
    }

    const nextAction = order ? getNextAction(order) : null;
    const busy = Boolean(order && actionOrderId === order.id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {order ? `Order #${order.id}` : "Loading order"}
                        </h3>
                        {order && <p className="mt-1 text-xs font-medium text-gray-500">Created {formatDate(order.createdAt)}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Close order detail"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {loading && <div className="p-6 text-sm text-gray-500">Loading order detail...</div>}

                {order && !loading && (
                    <div className="max-h-[calc(90vh-76px)] overflow-y-auto p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InfoPanel title="Order">
                                <div className="space-y-3">
                                    <StatusRow label="Status"><OrderStatusBadge value={order.status} /></StatusRow>
                                    <StatusRow label="Payment"><OrderStatusBadge value={order.paymentStatus} /></StatusRow>
                                    <StatusRow label="Shipping"><OrderStatusBadge value={order.shippingStatus} /></StatusRow>
                                </div>
                            </InfoPanel>

                            <InfoPanel title="Recipient">
                                <p className="font-semibold text-gray-900">{order.recipientName}</p>
                                <p className="mt-1 text-sm text-gray-600">{order.phoneNumber}</p>
                                <p className="mt-3 text-sm text-gray-600">{order.shippingAddress}</p>
                            </InfoPanel>

                            <InfoPanel title="Payment">
                                <p className="text-sm text-gray-600">Method: {order.payment?.method ?? "-"}</p>
                                <p className="mt-1 text-sm text-gray-600">Paid at: {formatDate(order.payment?.paidAt ?? null)}</p>
                                <p className="mt-1 text-sm text-gray-600">Code: {order.payment?.transactionCode ?? "-"}</p>
                            </InfoPanel>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-5 py-3">Product</th>
                                        <th className="px-5 py-3">SKU</th>
                                        <th className="px-5 py-3">Qty</th>
                                        <th className="px-5 py-3">Unit</th>
                                        <th className="px-5 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-gray-900">{item.productName}</p>
                                                <p className="mt-1 text-xs text-gray-500">{item.variantName}</p>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">{item.sku}</td>
                                            <td className="px-5 py-4 text-gray-600">{item.quantity}</td>
                                            <td className="px-5 py-4 text-gray-600">{formatMoney(item.unitPrice)}</td>
                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">{formatMoney(item.lineTotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_280px]">
                            <div className="rounded-lg border border-gray-200 p-5">
                                <h4 className="font-bold text-gray-900">Note</h4>
                                <p className="mt-2 text-sm text-gray-600">{order.note || "No note"}</p>
                                {order.couponCode && (
                                    <p className="mt-3 text-sm font-semibold text-emerald-700">Coupon: {order.couponCode}</p>
                                )}
                            </div>

                            <div className="rounded-lg border border-gray-200 p-5">
                                <PriceRow label="Subtotal" value={order.subtotalAmount} />
                                <PriceRow label="Shipping" value={order.shippingFee} />
                                <PriceRow label="Discount" value={-order.discountAmount} />
                                <div className="mt-3 border-t border-gray-100 pt-3">
                                    <PriceRow label="Total" value={order.totalAmount} strong />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                            >
                                Close
                            </button>
                            {nextAction && (
                                <button
                                    type="button"
                                    onClick={() => onAction(order.id, nextAction.action)}
                                    disabled={busy}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {busy ? "Updating..." : nextAction.label}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="rounded-lg border border-gray-200 p-5">
            <h4 className="mb-3 font-bold text-gray-900">{title}</h4>
            {children}
        </div>
    );
}

function StatusRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-500">{label}</span>
            {children}
        </div>
    );
}

function PriceRow({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
    return (
        <div className={`flex items-center justify-between text-sm ${strong ? "font-bold text-gray-900" : "text-gray-600"}`}>
            <span>{label}</span>
            <span>{formatMoney(value)}</span>
        </div>
    );
}
