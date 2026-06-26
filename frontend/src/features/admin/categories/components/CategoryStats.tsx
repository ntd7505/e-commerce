type CategoryStatsProps = {
  total: number;
  parentCount: number;
  childCount: number;
};

export function CategoryStats({ total, parentCount, childCount }: CategoryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-[12px] font-bold uppercase text-slate-500">Total</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900">{total}</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-[12px] font-bold uppercase text-slate-500">Parent Categories</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900">{parentCount}</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-[12px] font-bold uppercase text-slate-500">Child Categories</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900">{childCount}</p>
      </div>
    </div>
  );
}
