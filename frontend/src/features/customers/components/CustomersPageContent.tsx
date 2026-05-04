import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Users } from "lucide-react";
import { getAdminUsers } from "../adminUserApi";
import type { AdminUserResponse } from "../adminUserTypes";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  INACTIVE: "bg-red-50 text-red-700",
};

export default function CustomersPageContent() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) =>
      [user.fullName, user.email, user.phoneNumber]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    );
  }, [searchTerm, users]);

  const activeCount = users.filter((user) => user.status === "ACTIVE").length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900">Customers</h2>
          <p className="mt-1 text-[13px] text-gray-500">Danh sách người dùng từ hệ thống backend.</p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-[12px] font-bold uppercase text-gray-400">Total users</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-[12px] font-bold uppercase text-gray-400">Active</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-600">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-[12px] font-bold uppercase text-gray-400">Inactive</p>
          <p className="mt-2 text-3xl font-extrabold text-red-500">{users.length - activeCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5">
          <div className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
            <Users className="h-4 w-4 text-emerald-600" />
            User directory
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search name, email, phone"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-[13px] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {error && <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-[13px] font-medium text-red-600">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr>
                <th className="px-5 py-3 font-bold">Name</th>
                <th className="px-5 py-3 font-bold">Email</th>
                <th className="px-5 py-3 font-bold">Phone</th>
                <th className="px-5 py-3 font-bold">Roles</th>
                <th className="px-5 py-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-bold text-gray-900">{user.fullName}</td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4 text-gray-600">{user.phoneNumber}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {user.roles?.map((role) => role.name).join(", ") || "USER"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[user.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {user.status}
                      </span>
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
