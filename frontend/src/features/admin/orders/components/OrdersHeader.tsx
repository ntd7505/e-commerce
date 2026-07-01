import { RefreshCw } from "lucide-react";

type OrdersHeaderProps = {
    loading: boolean;
    onRefresh: () => void;
};

export function OrdersHeader({ loading, onRefresh }: OrdersHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-xl font-bold text-text">Orders</h2>
                <p className="text-sm text-muted">Track order fulfillment, payment and shipping status.</p>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
            </button>
        </div>
    );
}
