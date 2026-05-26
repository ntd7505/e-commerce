type AdminStatCardProps = {
  label: string;
  value: number | string;
  helper?: string;
};

export function AdminStatCard({ label, value, helper }: AdminStatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {helper && <p className="mt-1 text-xs font-medium text-gray-500">{helper}</p>}
    </div>
  );
}
