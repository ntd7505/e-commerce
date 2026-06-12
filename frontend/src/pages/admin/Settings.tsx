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
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500">Configure admin-facing defaults. These values are stored locally until backend settings APIs exist.</p>
        </div>
        <button
          type="button"
          onClick={saveSettings}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
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
          <section className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="font-bold text-gray-900">Store Profile</h3>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Shop Name">
                <input
                  value={settings.shopName}
                  onChange={(event) => updateField("shopName", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </Field>
              <Field label="Default Currency">
                <input
                  value={settings.defaultCurrency}
                  onChange={(event) => updateField("defaultCurrency", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </Field>
              <Field label="Support Email">
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(event) => updateField("supportEmail", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </Field>
              <Field label="Support Phone">
                <input
                  value={settings.supportPhone}
                  onChange={(event) => updateField("supportPhone", event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="font-bold text-gray-900">Operations</h3>
            </div>
            <div className="space-y-5 p-6">
              <Field label="Low Stock Threshold">
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(event) => updateField("lowStockThreshold", Number(event.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
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

        <aside className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-gray-900">Backend Gap</h3>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            This page is ready as an admin settings surface, but persistence is local only. To make it production-backed,
            add admin settings endpoints for loading and saving system configuration.
          </p>
          <div className="mt-5 rounded-lg bg-gray-50 p-4 text-xs font-medium text-gray-600">
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
      <span className="mb-2 block text-sm font-bold text-gray-800">{label}</span>
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
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 p-4">
      <div>
        <p className="font-bold text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-emerald-600" : "bg-gray-300"}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
