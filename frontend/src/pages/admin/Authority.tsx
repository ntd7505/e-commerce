import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { Button, Badge, Container, Section } from "../../components/common";
import { AdminImage } from "../../components/admin/AdminImage";
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
      setRolesError("Không thể tải danh sách vai trò. Vui lòng kiểm tra quyền ADMIN hoặc API roles.");
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
            <h2 className="text-2xl font-bold text-text">Quản lý Phân Quyền</h2>
            <p className="mt-1 text-sm text-muted">
              Xem chi tiết vai trò và quyền hạn được gán cho từng tài khoản. Để thay đổi vai trò, vui lòng sử dụng API backend trực tiếp.
            </p>
          </div>
          <Button
            onClick={loadData}
            disabled={loading}
            variant="outline"
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
          >
            Làm mới
          </Button>
        </div>

        {/* Roles error */}
        {rolesError && !loading && (
          <div className="flex items-center gap-2 rounded-xl border border-warning/20 bg-warning-soft px-4 py-3 text-sm font-semibold text-warning">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {rolesError}
          </div>
        )}

        {/* Role overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-4 rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
              Đang tải danh sách vai trò...
            </div>
          ) : rolesError ? (
            <div className="col-span-4 rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
              Dữ liệu vai trò không khả dụng.
            </div>
          ) : (
            roles.map((role) => {
              const count = users.filter((u) =>
                u.roles?.some((r) => r.name === role.name)
              ).length;
              return (
                <div
                  key={role.name}
                  className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    <p className="text-sm font-bold text-text-muted">{role.name}</p>
                  </div>
                  <p className="text-3xl font-black text-text">{count}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">
                    {role.permissions?.length ?? 0} quyền hạn được gán
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* User - Role table */}
        <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-text">
              <Users className="h-4 w-4 text-primary" />
              Phân bổ vai trò người dùng
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="w-full rounded-lg border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-alt text-xs font-bold text-muted border-b border-border">
                <tr>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Người dùng</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Trạng thái</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider">Vai trò đã cấp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-muted font-medium">Đang tải người dùng...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-muted font-medium">Không tìm thấy người dùng nào.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-surface-alt/25">
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
                      <td className="px-5 py-4 text-muted font-medium">{user.email}</td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={user.status === "ACTIVE" ? "success" : "danger"}
                          dot
                        >
                          {user.status === "ACTIVE" ? "Hoạt động" : "Khoá"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles?.length ? (
                            user.roles.map((role) => (
                              <Badge
                                key={role.name}
                                variant="primary"
                                size="sm"
                              >
                                {role.name}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="neutral" size="sm">
                              USER
                            </Badge>
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

