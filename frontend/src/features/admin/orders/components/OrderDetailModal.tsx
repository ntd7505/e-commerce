import type { ReactNode } from "react";
import type { OrderResponse } from "../adminOrderTypes";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Modal, Button } from "../../../../components/common";

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
        return { label: "Xác nhận đơn", action: "CONFIRM" };
    }

    if (order.status === "CONFIRMED") {
        return { label: "Đang xử lý", action: "PROCESS" };
    }

    if (order.status === "PROCESSING") {
        return { label: "Bắt đầu giao", action: "SHIP" };
    }

    if (order.status === "SHIPPING") {
        return { label: "Đã giao thành công", action: "DELIVER" };
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
    const isOpen = Boolean(order || loading);
    const nextAction = order ? getNextAction(order) : null;
    const busy = Boolean(order && actionOrderId === order.id);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={order ? `Đơn hàng #${order.id}` : "Đang tải..."}
            maxWidth="max-w-4xl"
        >
            {loading && <div className="py-10 text-center text-sm font-semibold text-muted">Đang tải thông tin đơn hàng...</div>}

            {order && !loading && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <InfoPanel title="Đơn hàng">
                            <div className="space-y-3">
                                <StatusRow label="Trạng thái"><OrderStatusBadge value={order.status} /></StatusRow>
                                <StatusRow label="Thanh toán"><OrderStatusBadge value={order.paymentStatus} /></StatusRow>
                                <StatusRow label="Vận chuyển"><OrderStatusBadge value={order.shippingStatus} /></StatusRow>
                            </div>
                        </InfoPanel>

                        <InfoPanel title="Người nhận">
                            <p className="font-bold text-text">{order.recipientName}</p>
                            <p className="mt-1 text-sm font-medium text-muted">{order.phoneNumber}</p>
                            <p className="mt-3 text-sm font-medium text-muted leading-relaxed">{order.shippingAddress}</p>
                        </InfoPanel>

                        <InfoPanel title="Thanh toán">
                            <p className="text-sm font-medium text-muted">Phương thức: <span className="font-bold text-text">{order.payment?.method ?? "-"}</span></p>
                            <p className="mt-1.5 text-sm font-medium text-muted">Thời gian: <span className="font-bold text-text">{formatDate(order.payment?.paidAt ?? null)}</span></p>
                            <p className="mt-1.5 text-sm font-medium text-muted">Mã GD: <span className="font-bold text-text">{order.payment?.transactionCode ?? "-"}</span></p>
                        </InfoPanel>
                    </div>

                    <div className="overflow-x-auto overflow-hidden rounded-xl border border-border">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-surface-alt text-xs font-bold uppercase tracking-wider text-muted border-b border-border">
                                <tr>
                                    <th className="px-5 py-3">Sản phẩm</th>
                                    <th className="px-5 py-3">Mã SKU</th>
                                    <th className="px-5 py-3 text-center">Số lượng</th>
                                    <th className="px-5 py-3 text-right">Đơn giá</th>
                                    <th className="px-5 py-3 text-right font-bold">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {order.items.map((item) => (
                                    <tr key={item.id} className="transition-colors hover:bg-surface-alt/50">
                                        <td className="px-5 py-4">
                                            <p className="font-bold text-text leading-tight">{item.productName}</p>
                                            <p className="mt-1 text-xs font-medium text-muted">{item.variantName}</p>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-text">{item.sku}</td>
                                        <td className="px-5 py-4 text-center font-bold text-text">{item.quantity}</td>
                                        <td className="px-5 py-4 font-semibold text-text">{formatMoney(item.unitPrice)}</td>
                                        <td className="px-5 py-4 text-right font-extrabold text-text">{formatMoney(item.lineTotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_300px]">
                        <div className="rounded-xl border border-border bg-surface p-5">
                            <h4 className="font-bold text-text">Ghi chú</h4>
                            <p className="mt-2 text-sm font-semibold text-muted leading-relaxed">{order.note || "Không có ghi chú"}</p>
                            {order.couponCode && (
                                <p className="mt-3 text-sm font-bold text-success">Mã giảm giá đã áp dụng: {order.couponCode}</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
                            <PriceRow label="Tạm tính" value={order.subtotalAmount} />
                            <PriceRow label="Phí vận chuyển" value={order.shippingFee} />
                            <PriceRow label="Giảm giá" value={-order.discountAmount} />
                            <div className="border-t border-border pt-3">
                                <PriceRow label="Tổng cộng" value={order.totalAmount} strong />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                        >
                            Đóng
                        </Button>
                        {nextAction && (
                            <Button
                                variant="success"
                                onClick={() => onAction(order.id, nextAction.action)}
                                disabled={busy}
                                loading={busy}
                            >
                                {nextAction.label}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-surface p-5">
            <h4 className="mb-3 font-bold text-text border-b border-border pb-2">{title}</h4>
            {children}
        </div>
    );
}

function StatusRow({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-muted">{label}</span>
            {children}
        </div>
    );
}

function PriceRow({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
    return (
        <div className={`flex items-center justify-between text-sm ${strong ? "font-bold text-text" : "font-medium text-muted"}`}>
            <span>{label}</span>
            <span className={strong ? "text-base font-extrabold text-text" : ""}>{formatMoney(value)}</span>
        </div>
    );
}

