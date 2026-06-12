import { X } from "lucide-react";
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
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h3 className="text-[16px] font-bold text-gray-900">
            {editingCategory ? "Edit Category" : "Add Category"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="e.g. Smartphones"
              className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-medium text-gray-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">
              Parent Category
            </label>
            <select
              value={parentCategoryId}
              onChange={(event) => onParentChange(event.target.value)}
              disabled={saving}
              className="w-full rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-medium text-gray-900 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">No parent category</option>
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
            <label className="mb-2 block text-[13px] font-bold text-[#0B2113]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Short category description"
              className="min-h-[96px] w-full resize-none rounded-lg border border-gray-200 bg-[#f8f9fa] px-4 py-3 text-[13px] font-medium text-gray-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[13px] font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {saving ? "Saving..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
