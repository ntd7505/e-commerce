import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { AdminImage } from "../../../../components/admin/AdminImage";
import { LoadingState, ErrorState } from "../../../../components/common/States";
import { Container, Section } from "../../../../components/common";
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
    return <LoadingState />;
  }

  if (error || !user) {
    return <ErrorState message={error || "Không tìm thấy thông tin tài khoản."} />;
  }

  return (
    <Container size="default">
      <Section spacing="md">
        <div>
          <h2 className="text-2xl font-bold text-text">Admin Profile</h2>
          <p className="mt-1 text-sm text-muted">Thông tin tài khoản đang đăng nhập.</p>
        </div>

        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-success-soft text-success">
              <AdminImage
                src={user.avatarUrl}
                alt={user.fullName}
                fallbackLabel={user.fullName}
                className="h-full w-full object-cover"
                fallbackClassName="h-full w-full rounded-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-text">{user.fullName}</h3>
              <span className="mt-2 inline-flex rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
                {user.status}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-surface-alt p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="mt-2 text-sm font-bold text-text">{user.email}</p>
            </div>
            <div className="rounded-lg bg-surface-alt p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted">
                <Phone className="h-4 w-4" />
                Số điện thoại
              </div>
              <p className="mt-2 text-sm font-bold text-text">{user.phoneNumber || "Chưa cập nhật"}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
              <ShieldCheck className="h-4 w-4" />
              Roles
            </div>
            <div className="flex flex-wrap gap-2">
              {user.roles?.map((role) => (
                <span key={role.name} className="rounded-md bg-surface-alt px-2.5 py-1 text-xs font-bold text-text">
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Section>
    </Container>
  );
}
