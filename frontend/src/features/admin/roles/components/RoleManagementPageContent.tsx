import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldCheck, KeyRound, Plus, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { createRole, getPermissions, getRoles } from "../adminRoleApi";
import type { PermissionResponse, RoleResponse } from "../adminRoleTypes";
import { Button, Badge, Modal, Container, Section } from "../../../../components/common";

type Tab = "ROLES" | "PERMISSIONS";

const emptyForm = { name: "", description: "", permissions: [] as string[] };

export default function RoleManagementPageContent() {
  const [activeTab, setActiveTab] = useState<Tab>("ROLES");
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [permissions, setPermissions] = useState<PermissionResponse[]>([]);
  const [formValues, setFormValues] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roleData, permissionData] = await Promise.all([getRoles(), getPermissions()]);
      setRoles(roleData);
      setPermissions(permissionData);
      
      // Auto select the first role if none is selected
      if (roleData.length > 0) {
        setSelectedRole(prev => {
          if (!prev) return roleData[0];
          const stillExists = roleData.find(r => r.name === prev.name);
          return stillExists || roleData[0];
        });
      }
      setError("");
    } catch {
      setError("Không thể tải dữ liệu phân quyền");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, []);

  const selectedPermissionSet = useMemo(() => new Set(formValues.permissions), [formValues.permissions]);

  const togglePermission = (name: string) =>
    setFormValues((prev) => ({
      ...prev,
      permissions: selectedPermissionSet.has(name)
        ? prev.permissions.filter((p) => p !== name)
        : [...prev.permissions, name],
    }));

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name.trim() || !formValues.description.trim()) {
      setError("Vui lòng nhập tên và mô tả role"); return;
    }
    if (formValues.permissions.length === 0) {
      setError("Vui lòng chọn ít nhất một quyền"); return;
    }
    try {
      setSaving(true);
      const created = await createRole({
        name: formValues.name.trim().toUpperCase(),
        description: formValues.description.trim(),
        permissions: formValues.permissions,
      });
      setRoles((prev) => [...prev, created]);
      setSelectedRole(created);
      setFormValues(emptyForm);
      setError("");
      setSuccessMsg(`Role "${created.name}" đã được tạo thành công!`);
      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setError("Không thể tạo role. Kiểm tra tên hoặc quyền.");
    } finally {
      setSaving(false);
    }
  };

  const tabs: Array<{ value: Tab; label: string; icon: React.ElementType; count?: number }> = [
    { value: "ROLES", label: "Roles", icon: ShieldCheck, count: roles.length },
    { value: "PERMISSIONS", label: "Permissions", icon: KeyRound, count: permissions.length },
  ];

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
        {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Phân quyền & Vai trò</h2>
          <p className="mt-1 text-sm text-muted">Quản lý vai trò và quyền hạn trong hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadData}
            disabled={loading}
            variant="outline"
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
          >
            Làm mới
          </Button>
          <Button
            onClick={() => {
              setFormValues(emptyForm);
              setError("");
              setIsModalOpen(true);
            }}
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Tạo vai trò
          </Button>
        </div>
      </div>

      {error && !isModalOpen && (
        <div className="flex items-center gap-2 rounded-lg border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {successMsg && !isModalOpen && (
        <div className="flex items-center gap-2 rounded-lg border border-success-soft bg-success-soft px-4 py-3 text-sm font-medium text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex w-fit rounded-lg border border-border bg-surface-alt p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition-all ${activeTab === tab.value
                ? "bg-surface text-primary shadow-sm"
                : "text-muted hover:text-text hover:bg-surface/50"
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === tab.value ? "bg-primary-soft text-primary" : "bg-border text-muted"
                  }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Roles (Master-Detail) */}
      {activeTab === "ROLES" && (
        <div className="rounded-xl border border-border bg-surface flex flex-col lg:flex-row overflow-hidden min-h-[500px] shadow-sm">
          {/* Master: Roles List */}
          <div className="w-full lg:w-[280px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface-alt/30 flex flex-col">
            <div className="p-4 border-b border-border bg-surface shrink-0 flex items-center justify-between">
              <h3 className="font-bold text-text">Danh sách vai trò</h3>
              <Badge variant="neutral">{roles.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted">Đang tải...</div>
              ) : roles.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted">Chưa có vai trò nào.</div>
              ) : (
                <div className="space-y-1">
                  {roles.map((role) => {
                    const isSelected = selectedRole?.name === role.name;
                    return (
                      <button
                        key={role.name}
                        onClick={() => setSelectedRole(role)}
                        className={`w-full text-left p-3 rounded-r-lg border-l-2 flex items-start gap-3 transition-colors ${
                          isSelected 
                            ? "bg-primary-soft text-primary border-primary shadow-sm" 
                            : "hover:bg-surface-alt text-text border-transparent"
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 ${isSelected ? "text-primary" : "text-muted"}`}>
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{role.name}</div>
                          <p className={`text-xs truncate mt-0.5 ${isSelected ? "text-primary/80" : "text-muted"}`}>
                            {role.description || "Không có mô tả"}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <Badge variant={isSelected ? "primary" : "neutral"} size="sm">
                              {role.permissions?.length ?? 0} quyền
                            </Badge>
                          </div>
                        </div>
                        {isSelected && (
                          <ChevronRight className="w-4 h-4 shrink-0 text-primary self-center" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Detail: Selected Role */}
          <div className="flex-1 flex flex-col bg-surface min-w-0">
            {selectedRole ? (
              <>
                {/* Detail Header */}
                <div className="p-5 sm:p-6 border-b border-border shrink-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-surface/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-soft border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm shadow-primary/5">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-text tracking-tight">{selectedRole.name}</h3>
                      <p className="text-sm text-muted mt-1 leading-relaxed max-w-2xl">{selectedRole.description || "Vai trò này chưa có mô tả."}</p>
                    </div>
                  </div>
                  {/* Backend does not currently support Edit/Delete for roles, so buttons are omitted to match BE logic */}
                </div>

                {/* Permissions List */}
                <div className="p-5 sm:p-6 flex-1 overflow-y-auto bg-surface-alt/10">
                  <h4 className="font-bold text-text mb-4 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-primary" />
                    Quyền hạn được cấp
                    <Badge variant="neutral" size="sm">{selectedRole.permissions?.length ?? 0}</Badge>
                  </h4>
                  {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {selectedRole.permissions.map(p => (
                        <div key={p.name} className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-surface transition-colors hover:border-primary/30 hover:shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span className="block text-sm font-bold text-text truncate">{p.name}</span>
                            {p.description && (
                              <span className="block text-xs text-muted mt-1 leading-relaxed line-clamp-2" title={p.description}>{p.description}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-10 border border-dashed border-border rounded-2xl bg-surface">
                      <KeyRound className="mx-auto mb-3 h-8 w-8 text-muted/40" />
                      <p className="text-sm font-semibold text-text">Không có quyền hạn</p>
                      <p className="text-xs text-muted mt-1">Vai trò này chưa được cấp bất kỳ quyền nào.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full min-h-[300px] bg-surface-alt/10">
                <div className="w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-muted/50" />
                </div>
                <h3 className="text-lg font-bold text-text">Chưa chọn vai trò</h3>
                <p className="text-sm text-muted max-w-sm mt-1">
                  Hãy chọn một vai trò từ danh sách bên trái để xem chi tiết thông tin và quyền hạn.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Permissions */}
      {activeTab === "PERMISSIONS" && (
        <section className="rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center gap-2 border-b border-border p-5 text-sm font-bold text-text">
            <KeyRound className="h-4 w-4 text-primary" />
            Danh sách tất cả quyền
            <Badge variant="neutral" className="ml-1">
              {permissions.length}
            </Badge>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted">Đang tải quyền...</div>
          ) : (
            <div className="grid gap-px bg-border sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {permissions.map((p) => (
                <div key={p.name} className="bg-surface p-5 transition-colors hover:bg-surface-alt">
                  <p className="text-sm font-bold text-text truncate" title={p.name}>{p.name}</p>
                  {p.description && (
                    <p className="mt-1.5 text-xs text-muted leading-relaxed line-clamp-2" title={p.description}>{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Create Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title="Tạo vai trò mới"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleCreateRole} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-danger-soft bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text">
                Tên vai trò <span className="text-danger">*</span>
              </label>
              <input
                value={formValues.name}
                onChange={(e) => setFormValues((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ví dụ: ROLE_MANAGER"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                disabled={saving}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text">
                Mô tả <span className="text-danger">*</span>
              </label>
              <input
                value={formValues.description}
                onChange={(e) => setFormValues((p) => ({ ...p, description: e.target.value }))}
                placeholder="Ví dụ: Quản lý cửa hàng..."
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow"
                disabled={saving}
              />
            </div>
          </div>
          
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-semibold text-text">
                Cấp quyền hạn <span className="text-danger">*</span>
              </label>
              <Badge variant={formValues.permissions.length > 0 ? "primary" : "neutral"} size="sm">
                Đã chọn {formValues.permissions.length} / {permissions.length}
              </Badge>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto rounded-xl border border-border bg-surface-alt/30 p-1.5 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <div className="grid sm:grid-cols-2 gap-1.5">
                {permissions.map((permission) => (
                  <label
                    key={permission.name}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-surface hover:border-border"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissionSet.has(permission.name)}
                      onChange={() => togglePermission(permission.name)}
                      disabled={saving}
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-text truncate">{permission.name}</span>
                      {permission.description && (
                        <span className="text-xs text-muted mt-0.5 block line-clamp-1">{permission.description}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-2 border-t border-border flex justify-end gap-3">
             <Button
               type="button"
               variant="outline"
               onClick={() => setIsModalOpen(false)}
               disabled={saving}
             >
               Hủy
             </Button>
             <Button
               type="submit"
               variant="primary"
               disabled={saving}
               leftIcon={saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
             >
               {saving ? "Đang tạo..." : "Xác nhận tạo vai trò"}
             </Button>
          </div>
        </form>
      </Modal>
      </Section>
    </Container>
  );
}
