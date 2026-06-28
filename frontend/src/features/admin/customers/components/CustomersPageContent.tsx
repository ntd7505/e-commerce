import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Users, Ban, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminBadge } from "../../../../components/admin/AdminBadge";
import { getAdminUsers, updateAdminUserStatus } from "../adminUserApi";
import type { AdminUserResponse } from "../adminUserTypes";

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

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
      setError("");
    } catch (requestError) {
      console.error("Failed to load users:", requestError);
      setError("Không th? t?i danh sách khách hàng");
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

  async function toggleUserStatus(user: AdminUserResponse) {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      setTogglingId(user.id);
      const updated = await updateAdminUserStatus(user.id, newStatus);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      console.error("Failed to update user status:", err);
    } finally {
      setTogglingId(null);
    }
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
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Customers</h2>
          <p className="mt-1 text-sm text-muted">
            Qu?n lý tài kho?n khách hàng – Ban/Unban tr?c ti?p.
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 text-sm font-bold text-text shadow-sm transition-colors hover:bg-surface disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
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
      <div className="rounded-2xl border border-border bg-surface shadow-sm">
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
                  const isBusy = togglingId === user.id;
                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-surface"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-xs font-bold text-success shrink-0">
                            {((user.fullName || user.email || "?")[0] || "?").toUpperCase()}
                          </div>
                          <span className="font-semibold text-text">{user.fullName}</span>
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
                          disabled={isBusy}
                          title={isActive ? "Ban user" : "Unban user"}
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
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-xs text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-border-strong p-1.5 text-muted transition-colors hover:bg-surface disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-muted">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] rounded-md border px-2 py-1 text-xs font-bold transition-colors ${p === currentPage
                          ? "border-success bg-success text-white"
                          : "border-border-strong text-muted hover:bg-surface"
                        }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-border-strong p-1.5 text-muted transition-colors hover:bg-surface disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
