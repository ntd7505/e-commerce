import { RefreshCw } from "lucide-react";
import { Button } from "../../../../components/common";

type OrdersHeaderProps = {
    loading: boolean;
    onRefresh: () => void;
};

export function OrdersHeader({ loading, onRefresh }: OrdersHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-text">Đơn hàng</h1>
                <p className="mt-1 text-sm font-medium text-muted">Quản lý tình trạng đơn hàng, thanh toán và giao hàng.</p>
            </div>

            <Button
                variant="secondary"
                onClick={onRefresh}
                disabled={loading}
                leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
            >
                Làm mới
            </Button>
        </div>
    );
}
