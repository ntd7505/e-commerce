import { useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { createRole, getPermissions, getRoles } from "../adminRoleApi";
import type { PermissionResponse, RoleResponse } from "../adminRoleTypes";

const emptyForm = {
  name: "",
  description: "",
  permissions: [] as string[],
};

export default function RoleManagementPageContent() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [formValues, setFormValues] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAccessData = async () => {
    try {
      setLoading(true);
      const [roleData, permissionData] = await Promise.all([getRoles(), getPermissions()]);
      setRoles(roleData);
      setPermissions(permissionData);
      setError("");
    } catch (requestError) {
      console.error("Failed to load access control data:", requestError);
      setError("Không thể tải dữ liệu phân quyền");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccessData();
  }, []);

  const selectedPermissionSet = useMemo(
    () => new Set(formValues.permissions),
    [formValues.permissions]
  );

  const togglePermission = (permissionName: string) => {
    setFormValues((prev) => ({
      ...prev,
      permissions: selectedPermissionSet.has(permissionName)
        ? prev.permissions.filter((name) => name !== permissionName)
        : [...prev.permissions, permissionName],
    }));
  };

  const handleCreateRole = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formValues.name.trim() || !formValues.description.trim()) {
      setError("Vui lòng nhập tên và mô tả role");
      return;
    }

    if (formValues.permissions.length === 0) {
      setError("Vui lòng chọn ít nhất một permission");
      return;
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
    } catch (requestError) {
      console.error("Failed to create role:", requestError);
      setError("Không thể tạo role. Kiểm tra tên role hoặc permissions.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900">Roles & Permissions</h2>
          <p className="mt-1 text-[13px] text-gray-500">Quản lý role và permission từ backend.</p>
        </div>
        <button
          type="button"
          onClick={loadAccessData}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 p-5 text-[13px] font-bold text-gray-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Existing roles
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-[13px] text-gray-500">Loading roles...</div>
            ) : roles.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-gray-500">No roles found.</div>
            ) : (
              roles.map((role) => (
                <article key={role.name} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-extrabold text-gray-900">{role.name}</h3>
                      <p className="mt-1 text-[13px] text-gray-500">{role.description || "No description"}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                      {role.permissions?.length ?? 0} permissions
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.permissions?.map((permission) => (
                      <span key={permission.name} className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <form onSubmit={handleCreateRole} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-[16px] font-bold text-gray-900">Create role</h3>
          <div className="mt-5 space-y-4">
            <input
              value={formValues.name}
              onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="ROLE_NAME"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] font-bold uppercase outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <textarea
              value={formValues.description}
              onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Role description"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase text-gray-400">Permissions</p>
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-gray-100 p-3">
                {permissions.map((permission) => (
                  <label key={permission.name} className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedPermissionSet.has(permission.name)}
                      onChange={() => togglePermission(permission.name)}
                      className="mt-0.5 h-4 w-4 accent-emerald-500"
                    />
                    <span>
                      <span className="block text-[12px] font-bold text-gray-800">{permission.name}</span>
                      {permission.description && <span className="text-[11px] text-gray-500">{permission.description}</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-[13px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
