type CategoryStatsProps = {
  total: number;
  parentCount: number;
  childCount: number;
};

export function CategoryStats({ total, parentCount, childCount }: CategoryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <p className="text-sm font-semibold text-muted">Total</p>
        <p className="mt-2 text-2xl font-extrabold text-text">{total}</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <p className="text-sm font-semibold text-muted">Parent Categories</p>
        <p className="mt-2 text-2xl font-extrabold text-text">{parentCount}</p>
      </div>
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <p className="text-sm font-semibold text-muted">Child Categories</p>
        <p className="mt-2 text-2xl font-extrabold text-text">{childCount}</p>
      </div>
    </div>
  );
}
