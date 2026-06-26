import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { AdminImage } from "../../../../components/admin/AdminImage";
import { getCurrentAdminUser } from "../../customers/adminUserApi";
import type { AdminUserResponse } from "../../customers/adminUserTypes";

export default function AdminProfileOverview() {
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentAdminUser();
        setUser(data);
        setError("");
      } catch (requestError) {
        console.error("Failed to load current admin profile:", requestError);
        setError("Không thể tải thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return <div className="mx-auto max-w-[900px] rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">Loading profile...</div>;
  }

  if (error || !user) {
    return <div className="mx-auto max-w-[900px] rounded-xl border border-red-100 bg-red-50 p-8 text-center text-sm font-medium text-red-600">{error || "Profile not found"}</div>;
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6 pb-10">
      <div>
        <h2 className="text-[22px] font-bold text-slate-900">Admin Profile</h2>
        <p className="mt-1 text-[13px] text-slate-500">Thông tin tài khoản đang đăng nhập.</p>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-600">
            <AdminImage
              src={user.avatarUrl}
              alt={user.fullName}
              fallbackLabel={user.fullName}
              className="h-full w-full object-cover"
              fallbackClassName="h-full w-full rounded-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">{user.fullName}</h3>
            <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              {user.status}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase text-slate-400">
              <Mail className="h-4 w-4" />
              Email
            </div>
            <p className="mt-2 text-[14px] font-bold text-slate-900">{user.email}</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase text-slate-400">
              <Phone className="h-4 w-4" />
              Phone
            </div>
            <p className="mt-2 text-[14px] font-bold text-slate-900">{user.phoneNumber}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            Roles
          </div>
          <div className="flex flex-wrap gap-2">
            {user.roles?.map((role) => (
              <span key={role.name} className="rounded-md bg-slate-100 px-2.5 py-1 text-[12px] font-bold text-slate-700">
                {role.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
