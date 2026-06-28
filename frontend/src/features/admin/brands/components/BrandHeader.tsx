import { PlusCircle } from "lucide-react";

type BrandHeaderProps = {
    loading: boolean;
    onRefresh: () => void;
    onAdd: () => void;
};

export function BrandHeader({ loading, onRefresh, onAdd }: BrandHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h2 className="text-2xl font-bold text-text">Brands</h2>
                <p className="mt-1 text-sm font-medium text-muted">
                    Manage product brands used in the catalog.
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-text shadow-sm hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Refresh
                </button>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-success"
                >
                    <PlusCircle className="h-4 w-4" /> Add Brand
                </button>
            </div>
        </div>
    );
}
