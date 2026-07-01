import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldCheck, KeyRound, Plus, CheckCircle2 } from "lucide-react";
import { createRole, getPermissions, getRoles } from "../adminRoleApi";
import type { PermissionResponse, RoleResponse } from "../adminRoleTypes";

type Tab = "ROLES" | "PERMISSIONS";

const emptyForm = { name: "", description: "", permissions: [] as string[] };

export default function RoleManagementPageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("ROLES");
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [formValues, setFormValues] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [roleData, permissionData] = await Promise.all([getRoles(), getPermissions()]);
      setRoles(roleData);
      setPermissions(permissionData);
      setError("");
    } catch {
      setError("Không thể tải dữ liệu phân quyền");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, []);

  const selectedPermissionSet = useMemo(() => new Set(formValues.permissions), [formValues.permissions]);

  const togglePermission = (name: string) =>
    setFormValues((prev) => ({
      ...prev,
      permissions: selectedPermissionSet.has(name)
        ? prev.permissions.filter((p) => p !== name)
        : [...prev.permissions, name],
    }));

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim() || !formValues.description.trim()) {
      setError("Vui lòng nhập tên và mô tả role"); return;
    }
    if (formValues.permissions.length === 0) {
      setError("Vui lòng chọn ít nhất một permission"); return;
    }
    try {
      setSaving(true);
      const created = await createRole({
        name: formValues.name.trim().toUpperCase(),
        description: formValues.description.trim(),
        permissions: formValues.permissions,
      });
      setRoles((prev) => [...prev, created]);
      setFormValues(emptyForm);
      setError("");
      setSuccessMsg(`Role "${created.name}" đã được tạo thành công!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Không thể tạo role. Kiểm tra tên hoặc permissions.");
    } finally {
      setSaving(false);
    }
  };

  const tabs: Array<{ value: Tab; label: string; icon: React.ElementType; count?: number }> = [
    { value: "ROLES", label: "Roles", icon: ShieldCheck, count: roles.length },
    { value: "PERMISSIONS", label: "Permissions", icon: KeyRound, count: permissions.length },
  ];

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Roles & Permissions</h2>
          <p className="mt-1 text-sm text-muted">Quản lý vai trò và quyền hạn trong hệ thống.</p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-text shadow-sm transition-colors hover:bg-surface disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-success-soft bg-success-soft px-4 py-3 text-sm font-medium text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex w-fit rounded-xl border border-border-strong bg-surface p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${activeTab === tab.value
                ? "bg-surface text-success shadow-sm"
                : "text-muted hover:text-text"
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === tab.value ? "bg-success-soft text-success" : "bg-border text-muted"
                  }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Roles */}
      {activeTab === "ROLES" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* Roles list */}
          <section className="rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5 text-sm font-bold text-text">
              <ShieldCheck className="h-4 w-4 text-success" />
              Existing Roles
              <span className="ml-1 rounded-full bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted">
                {roles.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-8 text-center text-sm text-muted">Loading roles...</div>
              ) : roles.length === 0 ? (
                <div className="p-8 text-center">
                  <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-subtle" />
                  <p className="text-sm text-muted">No roles yet. Create one ?</p>
                </div>
              ) : (
                roles.map((role) => (
                  <article key={role.name} className="p-5 transition-colors hover:bg-surface">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-text">{role.name}</h3>
                        <p className="mt-1 text-sm text-muted">{role.description || "No description"}</p>
                      </div>
                      <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
                        {role.permissions?.length ?? 0} permissions
                      </span>
                    </div>
                    {role.permissions && role.permissions.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {role.permissions.map((p) => (
                          <span
                            key={p.name}
                            className="rounded-md bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Create role form */}
          <form onSubmit={handleCreateRole} className="h-fit rounded-xl border border-border bg-surface p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Plus className="h-4 w-4 text-success" />
              <h3 className="text-base font-bold text-text">Create Role</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-muted">
                  Role Name
                </label>
                <input
                  value={formValues.name}
                  onChange={(e) => setFormValues((p) => ({ ...p, name: e.target.value }))}
                  placeholder="ROLE_MANAGER"
                  className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm font-bold uppercase outline-none transition focus:border-success focus:ring-1 focus:ring-success"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-muted">
                  Description
                </label>
                <textarea
                  value={formValues.description}
                  onChange={(e) => setFormValues((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Mô t? vai trò..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-success focus:ring-1 focus:ring-success"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-muted">
                  Permissions
                  <span className="ml-1 normal-case font-normal text-muted">
                    ({formValues.permissions.length} selected)
                  </span>
                </p>
                <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border-strong bg-surface p-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission.name}
                      className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-surface"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissionSet.has(permission.name)}
                        onChange={() => togglePermission(permission.name)}
                        className="mt-0.5 h-4 w-4 accent-emerald-500"
                      />
                      <span>
                        <span className="block text-xs font-bold text-text">{permission.name}</span>
                        {permission.description && (
                          <span className="text-xs text-muted">{permission.description}</span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-success px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-success disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Permissions */}
      {activeTab === "PERMISSIONS" && (
        <section className="rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center gap-2 border-b border-border p-5 text-sm font-bold text-text">
            <KeyRound className="h-4 w-4 text-success" />
            All Permissions
            <span className="ml-1 rounded-full bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted">
              {permissions.length}
            </span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted">Loading permissions...</div>
          ) : (
            <div className="grid gap-px bg-surface-alt sm:grid-cols-2 lg:grid-cols-3">
              {permissions.map((p) => (
                <div key={p.name} className="bg-surface p-4 transition-colors hover:bg-surface">
                  <p className="text-sm font-bold text-text">{p.name}</p>
                  {p.description && (
                    <p className="mt-1 text-xs text-muted">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
