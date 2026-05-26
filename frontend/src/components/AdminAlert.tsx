type AdminAlertProps = {
  tone: "success" | "error" | "info";
  children: React.ReactNode;
};

const toneClass = {
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
  error: "border-red-100 bg-red-50 text-red-600",
  info: "border-blue-100 bg-blue-50 text-blue-700",
};

export function AdminAlert({ tone, children }: AdminAlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${toneClass[tone]}`}>
      {children}
    </div>
  );
}
