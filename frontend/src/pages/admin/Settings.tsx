import { Settings as SettingsIcon } from "lucide-react";
import { AdminEmptyState } from "../../components/AdminEmptyState";

export default function Settings() {
  return (
    <AdminEmptyState
      icon={SettingsIcon}
      title="Settings are not configured yet"
      description="Trang settings đã có route ổn định nhưng backend chưa có API cấu hình shop/system. Nên bổ sung API settings trước khi thêm form lưu cấu hình."
    />
  );
}
