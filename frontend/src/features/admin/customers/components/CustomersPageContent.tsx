import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Users, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminBadge } from "../../../../components/admin/AdminBadge";
import { Modal, Container, Section } from "../../../../components/common";
import { Pagination } from "../../../../components/common/Pagination";
import { UserDetailsModal } from "./UserDetailsModal";
import { getAdminUsers, updateAdminUserStatus } from "../adminUserApi";
import type { AdminUserResponse, UserStatus } from "../adminUserTypes";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

const PAGE_SIZE = 10;

export default function CustomersPageContent() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ user: AdminUserResponse; newStatus: UserStatus } | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
      setError("");
    } catch (requestError) {
      console.error("Failed to load users:", requestError);
      setError("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const matchesKeyword = !keyword || [user.fullName, user.email, user.phoneNumber]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(keyword));
      const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });
  }, [searchTerm, statusFilter, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;

  async function handleConfirmToggle() {
    if (!confirmAction) return;
    const { user, newStatus } = confirmAction;
    
    try {
      setConfirmAction(null);
      setError("");
      setTogglingId(user.id!);
      const updated = await updateAdminUserStatus(user.id!, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      console.error("Failed to update user status:", err);
      setError("Không thể cập nhật trạng thái người dùng. Kiểm tra quyền admin hoặc thử lại.");
    } finally {
      setTogglingId(null);
    }
  }

  function toggleUserStatus(user: AdminUserResponse) {
    if (user.id == null) {
      setError("Không tìm thấy ID người dùng. Vui lòng restart backend và tải lại danh sách khách hàng.");
      return;
    }

    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setConfirmAction({ user, newStatus });
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  const statusFilters: Array<{ label: string; value: StatusFilter; color: string }> = [
    { label: "All", value: "ALL", color: "" },
    { label: "Active", value: "ACTIVE", color: "text-success" },
    { label: "Inactive", value: "INACTIVE", color: "text-danger" },
  ];

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
        {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Customers</h2>
          <p className="mt-1 text-sm text-muted">
            Quản lý tài khoản khách hàng – Ban/Unban trực tiếp.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-text shadow-sm transition-colors hover:bg-surface disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-xs font-semibold text-muted">Total Users</p>
          <p className="mt-3 text-3xl font-extrabold text-text">{users.length}</p>
          <p className="mt-1 text-xs text-muted">Registered accounts</p>
        </div>
        <div className="rounded-xl border border-success-soft bg-success-soft p-5 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-xs font-bold uppercase tracking-wider text-success">Active</p>
          <p className="mt-3 text-3xl font-extrabold text-success">{activeCount}</p>
          <p className="mt-1 text-xs text-success">Can login & purchase</p>
        </div>
        <div className="rounded-xl border border-danger-soft bg-danger-soft p-5 shadow-sm transition-shadow hover:shadow-md">
          <p className="text-xs font-bold uppercase tracking-wider text-danger">Banned</p>
          <p className="mt-3 text-3xl font-extrabold text-danger">{users.length - activeCount}</p>
          <p className="mt-1 text-xs text-danger">Access restricted</p>
        </div>
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-border bg-surface shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-text">
            <Users className="h-4 w-4 text-success" />
            User directory
            <span className="ml-1 rounded-full bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted">
              {filteredUsers.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Status filter */}
            <div className="flex rounded-lg border border-border-strong bg-surface p-1">
              {statusFilters.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFilterChange(opt.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${statusFilter === opt.value
                      ? "bg-surface shadow-sm text-success"
                      : `text-muted hover:text-text ${opt.color}`
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search name, email, phone"
                className="w-full rounded-lg border border-border-strong bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-success focus:ring-1 focus:ring-success"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="border-b border-danger-soft bg-danger-soft px-5 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-surface text-xs font-semibold text-muted">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Roles</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    <RefreshCw className="mx-auto h-5 w-5 animate-spin mb-2" />
                    Loading users...
                  </td>
                </tr>
              ) : pagedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <Users className="mx-auto mb-3 h-10 w-10 text-subtle" />
                    <p className="text-sm font-semibold text-muted">No users found</p>
                    {searchTerm && (
                      <p className="mt-1 text-xs text-muted">Try a different search term</p>
                    )}
                  </td>
                </tr>
              ) : (
                pagedUsers.map((user) => {
                  const isActive = user.status === "ACTIVE";
                  const isBusy = user.id != null && togglingId === user.id;
                  const hasUserId = user.id != null;
                  return (
                    <tr
                      key={user.id ?? user.email}
                      className="transition-colors hover:bg-surface"
                    >
                      <td className="px-5 py-4">
                        <div 
                          className="flex items-center gap-3 group cursor-pointer" 
                          title="Xem thông tin người dùng"
                          onClick={() => user.id && setSelectedUserId(user.id)}
                        >
                          {user.avatarUrl ? (
                            <img 
                                src={user.avatarUrl} 
                                alt={user.fullName || user.email} 
                                className="h-8 w-8 rounded-full object-cover shrink-0 border border-transparent transition-all duration-200 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-sm" 
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-xs font-bold text-success shrink-0 border border-transparent transition-all duration-200 group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-sm">
                              {((user.fullName || user.email || "?")[0] || "?").toUpperCase()}
                            </div>
                          )}
                          <span className="font-semibold text-text transition-colors duration-200 group-hover:text-primary">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted">{user.email}</td>
                      <td className="px-5 py-4 text-muted">{user.phoneNumber || "—"}</td>
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
                      <td className="px-5 py-4">
                        <AdminBadge
                          variant={isActive ? "success" : "danger"}
                          dot
                        >
                          {user.status}
                        </AdminBadge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => toggleUserStatus(user)}
                          disabled={isBusy || !hasUserId}
                          title={!hasUserId ? "Thiếu ID người dùng" : isActive ? "Ban user" : "Unban user"}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 ${isActive
                              ? "border-danger-soft bg-danger-soft text-danger hover:bg-danger-soft"
                              : "border-success-soft bg-success-soft text-success hover:bg-success-soft"
                            }`}
                        >
                          {isBusy ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : isActive ? (
                            <Ban className="h-3.5 w-3.5" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          {isActive ? "Ban" : "Unban"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between border-t border-border px-5 py-4 sm:flex-row">
            <p className="text-sm text-muted mb-4 sm:mb-0">
              Showing <span className="font-semibold text-text">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-semibold text-text">{Math.min(currentPage * PAGE_SIZE, filteredUsers.length)}</span> of <span className="font-semibold text-text">{filteredUsers.length}</span> entries
            </p>
            <Pagination 
              currentPage={currentPage - 1} 
              totalPages={totalPages} 
              onPageChange={(p) => setPage(p + 1)} 
            />
          </div>
        )}
      </div>

      <UserDetailsModal 
        isOpen={selectedUserId !== null} 
        onClose={() => setSelectedUserId(null)} 
        userId={selectedUserId} 
      />

      <Modal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        title="Xác nhận thao tác"
      >
        <div className="p-5">
          <p className="text-sm text-text">
            Bạn có chắc muốn {confirmAction?.newStatus === "INACTIVE" ? "khóa (ban)" : "mở khóa (unban)"} tài khoản <span className="font-bold">{confirmAction?.user.email}</span> không?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmAction(null)}
              className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-bold text-text transition-colors hover:bg-surface-alt"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirmToggle}
              className={`rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors ${
                confirmAction?.newStatus === "INACTIVE"
                  ? "bg-danger hover:bg-danger-hover"
                  : "bg-success hover:bg-success/90"
              }`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
      </Section>
    </Container>
  );
}
