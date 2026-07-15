import { AdminStatCard } from "../../../../components/admin/AdminStatCard";

type CategoryStatsProps = {
  total: number;
  parentCount: number;
  childCount: number;
};

export function CategoryStats({ total, parentCount, childCount }: CategoryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <AdminStatCard label="Tổng cộng" value={total} />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <AdminStatCard label="Danh mục cha" value={parentCount} />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <AdminStatCard label="Danh mục con" value={childCount} />
      </div>
    </div>
  );
}
