import { useState } from "react";
import { ArrowDown, ArrowUp, Check, Inbox, Plus, Trash2 } from "lucide-react";
import { Button } from "../../../../components/common/Button";
import { Badge } from "../../../../components/common/Badge";
import { updateProductSpecifications } from "../adminProductApi";
import type { ProductSpecificationRequest, ProductSpecificationResponse } from "../adminProductTypes";
import { useToast } from "../../../../features/ui/ToastProvider";

interface ProductSpecificationsEditorProps {
  productId: number;
  initialSpecs: ProductSpecificationResponse[];
  onReload: () => Promise<void>;
}

export function ProductSpecificationsEditor({ productId, initialSpecs, onReload }: ProductSpecificationsEditorProps) {
  const { showToast } = useToast();
  const [specs, setSpecs] = useState<Partial<ProductSpecificationResponse>[]>(
    [...initialSpecs].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [saving, setSaving] = useState(false);
  const [savedMoment, setSavedMoment] = useState(false);

  const handleAddSpec = () => {
    setSpecs((prev) => [
      ...prev,
      {
        groupName: "Thông tin chung",
        specKey: "",
        specValue: "",
        sortOrder: prev.length,
        active: true,
      },
    ]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ProductSpecificationResponse, value: unknown) => {
    setSpecs((prev) => prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= specs.length) return;
    setSpecs((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    for (let i = 0; i < specs.length; i += 1) {
      const spec = specs[i];
      if (!spec.specKey?.trim() || !spec.specValue?.trim()) {
        showToast(`Thông số kỹ thuật ở dòng ${i + 1} cần có tên và giá trị.`, "error");
        return;
      }
    }

    try {
      setSaving(true);
      const payload: ProductSpecificationRequest[] = specs.map((spec, index) => ({
        groupName: spec.groupName?.trim() || null,
        specKey: spec.specKey!.trim(),
        specValue: spec.specValue!.trim(),
        sortOrder: index,
        active: spec.active ?? true,
      }));

      await updateProductSpecifications(productId, { specifications: payload });
      setSavedMoment(true);
      setTimeout(() => setSavedMoment(false), 1800);
      await onReload();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.status === 403) {
        showToast("Bạn không có quyền cập nhật sản phẩm hoặc phiên đăng nhập admin đã hết hạn.", "error");
      } else {
        showToast("Lỗi khi lưu thông số kỹ thuật.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const groupsCount = new Set(specs.map((spec) => spec.groupName?.trim() || "Thông tin chung")).size;

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-canvas px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-text">Thông số kỹ thuật</h2>
          <Badge variant="neutral">
            {specs.length} thông số · {groupsCount} nhóm
          </Badge>
        </div>
        <Button
          variant={savedMoment ? "success" : "primary"}
          onClick={handleSave}
          loading={saving}
          leftIcon={savedMoment ? <Check className="h-4 w-4" /> : undefined}
        >
          {savedMoment ? "Đã lưu" : "Lưu thay đổi"}
        </Button>
      </div>

      <div className="p-6">
        {specs.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border bg-canvas">
            <div className="hidden grid-cols-12 gap-2 border-b border-border bg-[var(--surface-alt)] px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted md:grid">
              <div className="col-span-1 text-center">Vị trí</div>
              <div className="col-span-3">Nhóm thông số</div>
              <div className="col-span-3">Tên thông số</div>
              <div className="col-span-3">Giá trị</div>
              <div className="col-span-1 text-center">Trạng thái</div>
              <div className="col-span-1 text-center">Xóa</div>
            </div>

            <div className="divide-y divide-border">
              {specs.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface md:grid-cols-12 md:gap-2">
                  <div className="col-span-1 flex items-center justify-between md:justify-center">
                    <span className="text-xs font-bold text-text-muted md:hidden">Vị trí:</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0} className="p-1 text-muted transition-colors hover:text-primary disabled:opacity-30" title="Lên">
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleMove(index, 1)} disabled={index === specs.length - 1} className="p-1 text-muted transition-colors hover:text-primary disabled:opacity-30" title="Xuống">
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <input value={spec.groupName || ""} onChange={(e) => handleChange(index, "groupName", e.target.value)} placeholder="Thông tin chung" className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="col-span-3">
                    <input value={spec.specKey || ""} onChange={(e) => handleChange(index, "specKey", e.target.value)} placeholder="Kích thước" className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="col-span-3">
                    <input value={spec.specValue || ""} onChange={(e) => handleChange(index, "specValue", e.target.value)} placeholder="6.1 inch" className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <select value={spec.active ? "true" : "false"} onChange={(e) => handleChange(index, "active", e.target.value === "true")} className="h-10 rounded-md border border-border bg-surface px-2 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="true">Hiện</option>
                      <option value="false">Ẩn</option>
                    </select>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button type="button" onClick={() => handleRemoveSpec(index)} className="rounded-lg p-2 text-danger transition-colors hover:bg-danger/10" title="Xóa thông số">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-[var(--surface-alt)] px-4 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-canvas shadow-sm">
              <Inbox className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mb-1 text-base font-bold text-text">Chưa có thông số kỹ thuật</h3>
            <p className="mb-5 max-w-sm text-sm text-text-muted">
              Bổ sung các thông số chi tiết để khách hàng hiểu rõ hơn về sản phẩm.
            </p>
            <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={handleAddSpec}>
              Thêm thông số đầu tiên
            </Button>
          </div>
        )}

        {specs.length > 0 && (
          <Button variant="ghost" leftIcon={<Plus className="h-5 w-5" />} onClick={handleAddSpec} className="mt-4">
            Thêm thông số
          </Button>
        )}
      </div>
    </div>
  );
}
