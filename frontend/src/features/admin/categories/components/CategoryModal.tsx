import { X } from "lucide-react";
import { Button } from "../../../../components/common";
import type { CategoryResponse } from "../adminCategoryTypes";

type CategoryModalProps = {
  show: boolean;
  categories: CategoryResponse[];
  editingCategory: CategoryResponse | null;
  name: string;
  description: string;
  parentCategoryId: string;
  saving: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onParentChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function CategoryModal({
  show,
  categories,
  editingCategory,
  name,
  description,
  parentCategoryId,
  saving,
  onNameChange,
  onDescriptionChange,
  onParentChange,
  onClose,
  onSave,
}: CategoryModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-xl animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-border bg-surface-alt px-6 py-4">
          <h3 className="text-base font-bold text-text">
            {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-text">
              Tên danh mục <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Ví dụ: Điện thoại thông minh"
              className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-text">
              Danh mục cha
            </label>
            <select
              value={parentCategoryId}
              onChange={(event) => onParentChange(event.target.value)}
              disabled={saving}
              className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Không có danh mục cha</option>
              {categories
                .filter((category) => category.id !== editingCategory?.id)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.parent ? `${category.parent.name} / ${category.name}` : category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-text">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Mô tả ngắn gọn về danh mục"
              className="min-h-[96px] w-full resize-none rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border bg-surface px-6 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            disabled={saving}
            loading={saving}
          >
            Lưu danh mục
          </Button>
        </div>
      </div>
    </div>
  );
}
