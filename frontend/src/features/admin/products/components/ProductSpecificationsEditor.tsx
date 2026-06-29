import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Inbox, Check } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { updateProductSpecifications } from '../adminProductApi';
import type { ProductSpecificationResponse, ProductSpecificationRequest } from '../adminProductTypes';

interface ProductSpecificationsEditorProps {
  productId: number;
  initialSpecs: ProductSpecificationResponse[];
  onReload: () => Promise<void>;
}

export function ProductSpecificationsEditor({ productId, initialSpecs, onReload }: ProductSpecificationsEditorProps) {
  // Sort initial specs by sortOrder to display them correctly
  const sortedInitial = [...initialSpecs].sort((a, b) => a.sortOrder - b.sortOrder);
  
  const [specs, setSpecs] = useState<Partial<ProductSpecificationResponse>[]>(
    sortedInitial.length > 0 ? sortedInitial : []
  );
  const [saving, setSaving] = useState(false);
  const [savedMoment, setSavedMoment] = useState(false);

  const handleAddSpec = () => {
    setSpecs((prev) => [
      ...prev,
      {
        groupName: 'Thông tin chung',
        specKey: '',
        specValue: '',
        sortOrder: prev.length,
        active: true,
      },
    ]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ProductSpecificationResponse, value: any) => {
    setSpecs((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSpecs((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === specs.length - 1) return;
    setSpecs((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      if (!s.specKey?.trim() || !s.specValue?.trim()) {
        return alert(`Thông số kỹ thuật ở dòng ${i + 1} cần có tên (key) và giá trị (value).`);
      }
    }

    try {
      setSaving(true);
      // Recalculate sortOrder based on the final array index
      const payload: ProductSpecificationRequest[] = specs.map((s, index) => ({
        groupName: s.groupName?.trim() || null,
        specKey: s.specKey!.trim(),
        specValue: s.specValue!.trim(),
        sortOrder: index,
        active: s.active ?? true,
      }));

      await updateProductSpecifications(productId, { specifications: payload });
      
      // Delightful success state instead of alert
      setSavedMoment(true);
      setTimeout(() => setSavedMoment(false), 2000);
      
      await onReload();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert('Bạn không có quyền cập nhật sản phẩm hoặc phiên đăng nhập admin đã hết hạn.');
      } else {
        alert('Lỗi khi lưu thông số kỹ thuật.');
      }
    } finally {
      setSaving(false);
    }
  };

  const groupsCount = new Set(specs.map(s => s.groupName?.trim() || 'Thông tin chung')).size;

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-canvas">
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
          leftIcon={savedMoment ? <Check className="w-4 h-4" /> : undefined}
          className="transition-all duration-300"
        >
          {savedMoment ? 'Đã lưu!' : 'Lưu thay đổi'}
        </Button>
      </div>

      <div className="p-6">
        {specs.length > 0 ? (
          <div className="border border-border rounded-xl overflow-hidden bg-canvas">
            <div className="hidden md:grid grid-cols-12 gap-2 font-bold text-text-muted text-xs uppercase tracking-wider bg-[var(--surface-alt)] px-4 py-3 border-b border-border">
              <div className="col-span-1 text-center">Move</div>
              <div className="col-span-3">Nhóm thông số</div>
              <div className="col-span-3">Tên thông số</div>
              <div className="col-span-3">Giá trị</div>
              <div className="col-span-1 text-center">Trạng thái</div>
              <div className="col-span-1 text-center">Xoá</div>
            </div>

            <div className="divide-y divide-border">
              {specs.map((spec, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-2 items-center px-4 py-3 hover:bg-surface transition-colors">
                  <div className="col-span-1 flex items-center justify-between md:justify-center">
                    <span className="text-xs font-bold text-text-muted md:hidden">Move:</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-muted hover:text-primary disabled:opacity-30 transition-colors"
                        title="Lên"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === specs.length - 1}
                        className="p-1 text-muted hover:text-primary disabled:opacity-30 transition-colors"
                        title="Xuống"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      value={spec.groupName || ''}
                      onChange={(e) => handleChange(index, 'groupName', e.target.value)}
                      placeholder="Thông tin chung"
                      className="w-full h-10 px-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      value={spec.specKey || ''}
                      onChange={(e) => handleChange(index, 'specKey', e.target.value)}
                      placeholder="Kích thước"
                      className="w-full h-10 px-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="text"
                      value={spec.specValue || ''}
                      onChange={(e) => handleChange(index, 'specValue', e.target.value)}
                      placeholder="6.1 inch"
                      className="w-full h-10 px-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <select
                      value={spec.active ? 'true' : 'false'}
                      onChange={(e) => handleChange(index, 'active', e.target.value === 'true')}
                      className="h-10 px-2 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white font-medium"
                    >
                      <option value="true">Hiện</option>
                      <option value="false">Ẩn</option>
                    </select>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      title="Xoá thông số"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border rounded-lg bg-[var(--surface-alt)] opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-canvas border border-border rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Inbox className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-base font-bold text-text mb-1">Chưa có thông số kỹ thuật</h3>
            <p className="text-sm text-text-muted text-center max-w-sm mb-5">
              Bổ sung các thông số chi tiết (như Kích thước, Cân nặng, Màn hình...) để giúp khách hàng hiểu rõ hơn về sản phẩm.
            </p>
            <Button 
              variant="outline" 
              leftIcon={<Plus className="w-4 h-4" />} 
              onClick={handleAddSpec}
              className="hover:border-primary hover:text-primary transition-colors"
            >
              Thêm thông số đầu tiên
            </Button>
          </div>
        )}

        {specs.length > 0 && (
          <Button
            variant="ghost"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={handleAddSpec}
            className="mt-4"
          >
            Thêm thông số
          </Button>
        )}
      </div>
    </div>
  );
}
