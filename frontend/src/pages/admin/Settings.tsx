import { Save } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AdminAlert } from "../../components/admin/AdminAlert";
import { Button } from "../../components/common";

type AdminSettings = {
  shopName: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  lowStockThreshold: number;
  maintenanceMode: boolean;
  allowReviews: boolean;
  requireReviewApproval: boolean;
};

const STORAGE_KEY = "adminSettingsDraft";

const defaultSettings: AdminSettings = {
  shopName: "Dealport",
  supportEmail: "support@dealport.local",
  supportPhone: "",
  defaultCurrency: "VND",
  lowStockThreshold: 10,
  maintenanceMode: false,
  allowReviews: true,
  requireReviewApproval: false,
};

export default function Settings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings({ ...defaultSettings, ...JSON.parse(stored) });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function updateField<K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setMessage("");
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setMessage("Settings saved locally. Backend settings API is not available yet.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text">Cài đặt</h2>
          <p className="text-sm text-muted mt-1">Cấu hình chung cho hệ thống (Lưu nội bộ).</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Save className="h-4 w-4" />}
          onClick={saveSettings}
        >
          Lưu cài đặt
        </Button>
      </div>

      {message && (
        <AdminAlert tone="success">{message}</AdminAlert>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4 bg-surface-alt rounded-t-xl">
              <h3 className="font-bold text-text">Thông tin cửa hàng</h3>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Tên cửa hàng">
                <input
                  value={settings.shopName}
                  onChange={(event) => updateField("shopName", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="Tiền tệ mặc định">
                <input
                  value={settings.defaultCurrency}
                  onChange={(event) => updateField("defaultCurrency", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="Email hỗ trợ">
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(event) => updateField("supportEmail", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Field label="Số điện thoại hỗ trợ">
                <input
                  value={settings.supportPhone}
                  onChange={(event) => updateField("supportPhone", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border px-6 py-4 bg-surface-alt rounded-t-xl">
              <h3 className="font-bold text-text">Vận hành</h3>
            </div>
            <div className="space-y-5 p-6">
              <Field label="Cảnh báo tồn kho thấp (Low Stock Threshold)">
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(event) => updateField("lowStockThreshold", Number(event.target.value))}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </Field>
              <Toggle
                label="Chế độ bảo trì (Maintenance Mode)"
                description="Kích hoạt chế độ bảo trì để ẩn trang client (Hiện chỉ mang tính giả lập)."
                checked={settings.maintenanceMode}
                onChange={(value) => updateField("maintenanceMode", value)}
              />
              <Toggle
                label="Cho phép đánh giá (Allow Reviews)"
                description="Cho phép người dùng đánh giá sản phẩm."
                checked={settings.allowReviews}
                onChange={(value) => updateField("allowReviews", value)}
              />
              <Toggle
                label="Duyệt đánh giá (Require Review Approval)"
                description="Chỉ hiển thị đánh giá sau khi admin duyệt."
                checked={settings.requireReviewApproval}
                onChange={(value) => updateField("requireReviewApproval", value)}
              />
            </div>
          </section>
        </div>

        <aside className="rounded-xl border border-border bg-surface p-6 shadow-sm h-fit">
          <h3 className="font-bold text-text">Backend Gap</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Trang cài đặt này hiện chỉ lưu dữ liệu vào `localStorage` của trình duyệt. 
            Để hoạt động thực tế, bạn cần bổ sung API backend cho việc lưu trữ.
          </p>
          <div className="mt-5 rounded-lg border border-border bg-surface-alt p-4 text-xs font-mono text-muted">
            GET /api/v1/admin/settings<br />
            PUT /api/v1/admin/settings
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-text">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-alt p-5 transition-colors hover:bg-surface">
      <div>
        <p className="font-semibold text-text">{label}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${checked ? "bg-primary" : "bg-border-strong"}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-surface transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
