import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../../features/ui/ToastProvider";
import { Search, RefreshCw, Users, Ban, CheckCircle } from "lucide-react";
import { Modal, Container, Section, Button, Badge } from "../../../../components/common";
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
  const { showToast } = useToast();
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
      showToast("Không thể cập nhật trạng thái người dùng. Kiểm tra quyền admin hoặc thử lại.", "error");
    } finally {
      setTogglingId(null);
    }
  }

  function toggleUserStatus(user: AdminUserResponse) {
    if (user.id == null) {
      showToast("Không tìm thấy ID người dùng.", "error");
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
    { label: "Tất cả", value: "ALL", color: "" },
    { label: "Hoạt động", value: "ACTIVE", color: "text-success" },
    { label: "Đã khóa", value: "INACTIVE", color: "text-danger" },
  ];

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
        {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Khách hàng</h1>
          <p className="mt-1 text-sm font-medium text-muted">
            Quản lý tài khoản khách hàng – Khóa/Mở khóa trực tiếp.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={loadUsers}
          disabled={loading}
          leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
        >
          Làm mới
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="animate-fade-in-up rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md" style={{ animationDelay: '50ms' }}>
          <p className="text-xs font-semibold text-muted">Tổng số tài khoản</p>
          <p className="mt-3 text-3xl font-extrabold text-text">{users.length}</p>
          <p className="mt-1 text-xs text-muted">Tài khoản đã đăng ký</p>
        </div>
        <div className="animate-fade-in-up rounded-xl border border-success-soft bg-success-soft p-5 shadow-sm transition-all hover:shadow-md" style={{ animationDelay: '100ms' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-success">Hoạt động</p>
          <p className="mt-3 text-3xl font-extrabold text-success">{activeCount}</p>
          <p className="mt-1 text-xs text-success">Có thể đăng nhập & mua hàng</p>
        </div>
        <div className="animate-fade-in-up rounded-xl border border-danger-soft bg-danger-soft p-5 shadow-sm transition-all hover:shadow-md" style={{ animationDelay: '150ms' }}>
          <p className="text-xs font-bold uppercase tracking-wider text-danger">Đã khóa</p>
          <p className="mt-3 text-3xl font-extrabold text-danger">{users.length - activeCount}</p>
          <p className="mt-1 text-xs text-danger">Bị hạn chế truy cập</p>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface-alt p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-text">
            <Users className="h-4 w-4 text-success" />
            Danh bạ khách hàng
            <span className="ml-1 rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-primary shadow-inner">
              {filteredUsers.length}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Status filter */}
            <div className="flex rounded-lg border border-border-strong bg-surface p-1 shadow-inner">
              {statusFilters.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleFilterChange(opt.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${statusFilter === opt.value
                      ? "bg-surface-alt shadow-sm text-primary"
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
                placeholder="Tìm tên, email, SĐT"
                className="w-full rounded-lg border border-border-strong bg-surface py-2.5 pl-9 pr-3 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            <thead className="sticky top-0 z-10 bg-surface-alt text-xs font-bold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Họ tên</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Số điện thoại</th>
                <th className="px-5 py-3">Vai trò</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin text-primary" />
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : pagedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <Users className="mx-auto mb-3 h-10 w-10 text-muted" />
                    <p className="text-sm font-semibold text-text">Không tìm thấy khách hàng nào</p>
                    {searchTerm && (
                      <p className="mt-1 text-xs font-medium text-muted">Hãy thử một từ khóa tìm kiếm khác</p>
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
                                src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName?.[0] || 'A'}`}
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
                        <Badge
                          variant={isActive ? "success" : "danger"}
                        >
                          {user.status === "ACTIVE" ? "Hoạt động" : "Bị khóa"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                            <Button
                            variant={isActive ? "danger" : "success"}
                            size="sm"
                            onClick={() => toggleUserStatus(user)}
                            disabled={isBusy || !hasUserId}
                            loading={isBusy}
                            leftIcon={isActive ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                            title={!hasUserId ? "Thiếu ID người dùng" : isActive ? "Khóa tài khoản" : "Mở khóa"}
                            >
                            {isActive ? "Khóa" : "Mở khóa"}
                            </Button>
                        </div>
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
          <div className="flex flex-col items-center justify-between border-t border-border bg-surface-alt px-5 py-4 sm:flex-row">
            <p className="mb-4 text-sm font-medium text-muted sm:mb-0">
              Hiển thị <span className="font-bold text-text">{(currentPage - 1) * PAGE_SIZE + 1}</span> đến <span className="font-bold text-text">{Math.min(currentPage * PAGE_SIZE, filteredUsers.length)}</span> trong số <span className="font-bold text-text">{filteredUsers.length}</span> kết quả
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
        <div className="p-6">
          <p className="text-sm font-medium text-text">
            Bạn có chắc muốn {confirmAction?.newStatus === "INACTIVE" ? "khóa" : "mở khóa"} tài khoản <span className="font-bold">{confirmAction?.user.email}</span> không?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setConfirmAction(null)}
            >
              Hủy
            </Button>
            <Button
              variant={confirmAction?.newStatus === "INACTIVE" ? "danger" : "success"}
              onClick={handleConfirmToggle}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
      </Section>
    </Container>
  );
}

