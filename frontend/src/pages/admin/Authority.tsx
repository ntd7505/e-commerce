import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { AdminAlert } from "../../components/admin/AdminAlert";
import { AdminBadge } from "../../components/admin/AdminBadge";
import { getAdminUsers } from "../../features/admin/customers/adminUserApi";
import { getRoles } from "../../features/admin/roles/adminRoleApi";
import type { AdminUserResponse } from "../../features/admin/customers/adminUserTypes";
import type { RoleResponse } from "../../features/admin/roles/adminRoleTypes";

export default function Authority() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesError, setRolesError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    setRolesError("");

    // Load users and roles independently so a roles failure doesn't kill users.
    try {
      const userData = await getAdminUsers();
      setUsers(userData);
    } catch (err) {
      console.error("Failed to load users:", err);
    }

    try {
      const roleData = await getRoles();
      setRoles(roleData);
    } catch (err) {
      console.error("Failed to load roles:", err);
      setRolesError("Không thể tải danh sách vai trò. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    const kw = searchTerm.toLowerCase();
    if (!kw) return users;
    return users.filter((u) =>
      [u.fullName, u.email].some((v) => v?.toLowerCase().includes(kw))
    );
  }, [users, searchTerm]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-slate-900">Control Authority</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Xem vai trò của từng tài khoản. Để thay đổi role, dùng API backend trực tiếp.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 text-[13px] font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Roles error */}
      {rolesError && !loading && (
        <AdminAlert tone="warning">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {rolesError}
          </span>
        </AdminAlert>
      )}

      {/* Role overview */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-4 rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400">
            Loading roles...
          </div>
        ) : rolesError ? (
          <div className="col-span-4 rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-400">
            Role data unavailable.
          </div>
        ) : (
          roles.map((role) => {
            const count = users.filter((u) =>
              u.roles?.some((r) => r.name === role.name)
            ).length;
            return (
              <div
                key={role.name}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <p className="text-[12px] font-bold uppercase text-slate-500">{role.name}</p>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{count}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {role.permissions?.length ?? 0} permissions
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* User ↔ Role table */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
            <Users className="h-4 w-4 text-emerald-600" />
            User Role Assignments
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or email"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[13px] outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-bold">User</th>
                <th className="px-5 py-3 font-bold">Email</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold">Assigned Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-400">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-[12px] font-bold text-emerald-700 shrink-0">
                          {((user.fullName || user.email || "?")[0] || "?").toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{user.email}</td>
                    <td className="px-5 py-4">
                      <AdminBadge
                        variant={user.status === "ACTIVE" ? "success" : "danger"}
                        dot
                      >
                        {user.status}
                      </AdminBadge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.length ? (
                          user.roles.map((role) => (
                            <span
                              key={role.name}
                              className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700"
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                            USER
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
