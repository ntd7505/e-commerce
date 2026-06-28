import { Save } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { AdminAlert } from "../../components/admin/AdminAlert";

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
          <h2 className="text-xl font-bold text-text">Settings</h2>
          <p className="text-sm text-muted">Configure admin-facing defaults. These values are stored locally until backend settings APIs exist.</p>
        </div>
        <button
          type="button"
          onClick={saveSettings}
          className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-success"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>

      {message && (
        <AdminAlert tone="success">{message}</AdminAlert>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface">
            <div className="border-b border-border px-6 py-4">
              <h3 className="font-bold text-text">Store Profile</h3>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Shop Name">
                <input
                  value={settings.shopName}
                  onChange={(event) => updateField("shopName", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm outline-none focus:border-success"
                />
              </Field>
              <Field label="Default Currency">
                <input
                  value={settings.defaultCurrency}
                  onChange={(event) => updateField("defaultCurrency", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm outline-none focus:border-success"
                />
              </Field>
              <Field label="Support Email">
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(event) => updateField("supportEmail", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm outline-none focus:border-success"
                />
              </Field>
              <Field label="Support Phone">
                <input
                  value={settings.supportPhone}
                  onChange={(event) => updateField("supportPhone", event.target.value)}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm outline-none focus:border-success"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface">
            <div className="border-b border-border px-6 py-4">
              <h3 className="font-bold text-text">Operations</h3>
            </div>
            <div className="space-y-5 p-6">
              <Field label="Low Stock Threshold">
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(event) => updateField("lowStockThreshold", Number(event.target.value))}
                  className="w-full rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm outline-none focus:border-success"
                />
              </Field>
              <Toggle
                label="Maintenance Mode"
                description="Use this as an admin-side planning flag until backend enforcement exists."
                checked={settings.maintenanceMode}
                onChange={(value) => updateField("maintenanceMode", value)}
              />
              <Toggle
                label="Allow Reviews"
                description="Controls the local admin preference for review collection."
                checked={settings.allowReviews}
                onChange={(value) => updateField("allowReviews", value)}
              />
              <Toggle
                label="Require Review Approval"
                description="Useful once review moderation APIs are added."
                checked={settings.requireReviewApproval}
                onChange={(value) => updateField("requireReviewApproval", value)}
              />
            </div>
          </section>
        </div>

        <aside className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-bold text-text">Backend Gap</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            This page is ready as an admin settings surface, but persistence is local only. To make it production-backed,
            add admin settings endpoints for loading and saving system configuration.
          </p>
          <div className="mt-5 rounded-lg bg-surface p-4 text-xs font-medium text-muted">
            Suggested API: GET /api/v1/admin/settings and PUT /api/v1/admin/settings
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-text">{label}</span>
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
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div>
        <p className="font-bold text-text">{label}</p>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-success" : "bg-gray-300"}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-surface transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
