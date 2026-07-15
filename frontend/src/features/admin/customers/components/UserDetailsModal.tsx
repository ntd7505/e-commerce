import { useEffect, useState } from "react";
import { Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Modal, Badge, Button } from "../../../../components/common";
import { AdminImage } from "../../../../components/admin/AdminImage";
import { getAdminUserById } from "../adminUserApi";
import type { AdminUserResponse } from "../adminUserTypes";

type UserDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
};

export function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadUser(id: number) {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminUserById(id);
      setUser(data);
    } catch (err) {
      console.error("Failed to load user details:", err);
      setError("Không thể tải thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen && userId != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync state
      void loadUser(userId);
    } else {
      setUser(null);
      setError("");
    }
  }, [isOpen, userId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết người dùng">
      <div className="p-5">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted">
            Đang tải thông tin...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-danger-soft bg-danger-soft p-4 text-center text-sm font-semibold text-danger">
            {error}
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center py-10 text-muted">
            Không tìm thấy thông tin
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header: Avatar & Basic Info */}
            <div className="flex flex-col items-center gap-4 border-b border-border pb-6 sm:flex-row sm:items-start">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-surface-alt bg-surface-alt">
                <AdminImage
                  src={user.avatarUrl}
                  alt={user.fullName || user.email}
                  fallbackLabel={user.fullName || user.email}
                  className="h-full w-full object-cover"
                  fallbackClassName="flex h-full w-full items-center justify-center bg-primary-soft text-xl font-bold text-primary"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-extrabold text-text">{user.fullName || "Chưa cập nhật tên"}</h3>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <Badge variant={user.status === "ACTIVE" ? "success" : "danger"}>
                    {user.status === "ACTIVE" ? "Hoạt động" : "Bị khóa"}
                  </Badge>
                  {user.roles?.map((role) => (
                    <span key={role.name} className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                      <ShieldCheck className="h-3 w-3" />
                      {role.name}
                    </span>
                  ))}
                  {(!user.roles || user.roles.length === 0) && (
                    <span className="flex items-center gap-1 rounded-md bg-surface-alt px-2 py-0.5 text-xs font-bold text-muted">
                      <User className="h-3 w-3" />
                      USER
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Details List */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted mb-1">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="font-bold text-text break-all">{user.email}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface-alt p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted mb-1">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </div>
                <p className="font-bold text-text">{user.phoneNumber || "Chưa cập nhật"}</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button
                variant="ghost"
                onClick={onClose}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
