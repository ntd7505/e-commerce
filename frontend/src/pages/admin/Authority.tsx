import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { AdminAlert } from "../../components/admin/AdminAlert";
import { AdminBadge } from "../../components/admin/AdminBadge";
import { AdminImage } from "../../components/admin/AdminImage";
import { Container, Section } from "../../components/common";
import { UserDetailsModal } from "../../features/admin/customers/components/UserDetailsModal";
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
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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
      console.warn("Failed to load roles:", err);
      setRolesError("Không thể tải danh sách vai trò. Vui lòng kiểm tra quyền ADMIN hoặc backend roles API.");
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
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">Control Authority</h2>
            <p className="mt-1 text-sm text-muted">
              Xem vai trò của từng tài khoản. Để thay đổi role, dùng API backend trực tiếp.
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-text shadow-sm transition-colors hover:bg-surface disabled:opacity-50"
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
            <div className="col-span-4 rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
              Loading roles...
            </div>
          ) : rolesError ? (
            <div className="col-span-4 rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
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
                  className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <p className="text-sm font-semibold text-muted">{role.name}</p>
                  </div>
                  <p className="text-2xl font-extrabold text-text">{count}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {role.permissions?.length ?? 0} permissions
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* User ? Role table */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-text">
              <Users className="h-4 w-4 text-success" />
              User Role Assignments
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or email"
                className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-success focus:ring-1 focus:ring-success"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-surface text-xs font-semibold text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">User</th>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Assigned Roles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-muted">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-muted">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-surface">
                      <td className="px-5 py-4">
                        <div 
                          className="flex items-center gap-3 group cursor-pointer" 
                          title="Xem thông tin người dùng"
                          onClick={() => user.id && setSelectedUserId(user.id)}
                        >
                          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-alt shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-sm">
                            <AdminImage
                              src={user.avatarUrl}
                              alt={user.fullName || user.email}
                              fallbackLabel={user.fullName || user.email}
                              className="h-full w-full object-cover"
                              fallbackClassName="flex h-full w-full items-center justify-center bg-success-soft text-xs font-bold text-success"
                            />
                          </div>
                          <span className="font-semibold text-text transition-colors duration-200 group-hover:text-primary">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted">{user.email}</td>
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
                                className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700"
                              >
                                {role.name}
                              </span>
                            ))
                          ) : (
                            <span className="rounded-md bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted">
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

        <UserDetailsModal 
          isOpen={selectedUserId !== null} 
          onClose={() => setSelectedUserId(null)} 
          userId={selectedUserId} 
        />
      </Section>
    </Container>
  );
}
