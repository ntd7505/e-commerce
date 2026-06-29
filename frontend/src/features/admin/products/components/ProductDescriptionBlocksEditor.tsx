import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, Image as ImageIcon, LayoutTemplate, Check } from 'lucide-react';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { updateProductDescriptionBlocks } from '../adminProductApi';
import type { ProductDescriptionBlockResponse, ProductDescriptionBlockType, ProductDescriptionBlockRequest } from '../adminProductTypes';
import { uploadProductImage } from '../adminProductUpload';

interface ProductDescriptionBlocksEditorProps {
  productId: number;
  initialBlocks: ProductDescriptionBlockResponse[];
  onReload: () => Promise<void>;
}

export function ProductDescriptionBlocksEditor({ productId, initialBlocks, onReload }: ProductDescriptionBlocksEditorProps) {
  // Sort initial blocks by sortOrder
  const sortedInitial = [...initialBlocks].sort((a, b) => a.sortOrder - b.sortOrder);

  const [blocks, setBlocks] = useState<Partial<ProductDescriptionBlockResponse>[]>(
    sortedInitial.length > 0 ? sortedInitial : []
  );
  const [saving, setSaving] = useState(false);
  const [savedMoment, setSavedMoment] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(new Set([0]));

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleAddBlock = () => {
    setBlocks((prev) => {
      const next = [
        ...prev,
        {
          type: 'TEXT' as ProductDescriptionBlockType,
          sortOrder: prev.length,
          active: true,
          title: '',
          content: '',
          imageUrl: '',
          altText: '',
        },
      ];
      setExpandedIndexes((prevExpanded) => {
        const nextExpanded = new Set(prevExpanded);
        nextExpanded.add(next.length - 1);
        return nextExpanded;
      });
      return next;
    });
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setExpandedIndexes((prev) => {
      const next = new Set<number>();
      prev.forEach(val => {
        if (val < index) next.add(val);
        else if (val > index) next.add(val - 1);
      });
      return next;
    });
  };

  const handleChange = (index: number, field: keyof ProductDescriptionBlockResponse, value: any) => {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, [field]: value } : block))
    );
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    setBlocks((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      const hasCurrent = next.has(index);
      const hasAbove = next.has(index - 1);
      if (hasCurrent) next.add(index - 1); else next.delete(index - 1);
      if (hasAbove) next.add(index); else next.delete(index);
      return next;
    });
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === blocks.length - 1) return;
    setBlocks((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      const hasCurrent = next.has(index);
      const hasBelow = next.has(index + 1);
      if (hasCurrent) next.add(index + 1); else next.delete(index + 1);
      if (hasBelow) next.add(index); else next.delete(index);
      return next;
    });
  };

  const handleImageUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const url = await uploadProductImage(file);
      handleChange(index, 'imageUrl', url);
    } catch (err) {
      alert('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    // Validate
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (!b.type) return alert(`Khối nội dung ở dòng ${i + 1} thiếu loại (type).`);
      if (b.type === 'TEXT' && !b.title && !b.content) {
        return alert(`Khối nội dung ở dòng ${i + 1} (Văn bản) cần có tiêu đề hoặc nội dung.`);
      }
      if (b.type === 'IMAGE' && !b.imageUrl) {
        return alert(`Khối nội dung ở dòng ${i + 1} (Hình ảnh) cần có hình ảnh.`);
      }
      if (b.type === 'TEXT_IMAGE' && (!b.imageUrl || (!b.title && !b.content))) {
        return alert(`Khối nội dung ở dòng ${i + 1} (Văn bản + ảnh) cần có hình ảnh và văn bản.`);
      }
    }

    try {
      setSaving(true);
      const payload: ProductDescriptionBlockRequest[] = blocks.map((b, i) => ({
        type: b.type as ProductDescriptionBlockType,
        title: b.title?.trim() || null,
        content: b.content?.trim() || null,
        imageUrl: b.imageUrl?.trim() || null,
        altText: b.altText?.trim() || null,
        sortOrder: i,
        active: b.active ?? true,
      }));

      await updateProductDescriptionBlocks(productId, { blocks: payload });
      
      // Delightful success state instead of alert
      setSavedMoment(true);
      setTimeout(() => setSavedMoment(false), 2000);
      
      await onReload();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        alert('Bạn không có quyền cập nhật sản phẩm hoặc phiên đăng nhập admin đã hết hạn.');
      } else {
        alert('Lỗi khi lưu mô tả chi tiết.');
      }
    } finally {
      setSaving(false);
    }
  };

  const getPreviewText = (block: Partial<ProductDescriptionBlockResponse>) => {
    if (block.title) return block.title;
    if (block.content) return block.content.substring(0, 40) + (block.content.length > 40 ? '...' : '');
    if (block.imageUrl) return block.imageUrl.substring(block.imageUrl.lastIndexOf('/') + 1) || 'Hình ảnh';
    return 'Chưa có nội dung';
  };

  const getTypeVariant = (type?: string): "primary" | "success" | "warning" | "neutral" => {
    switch (type) {
      case 'TEXT': return 'primary';
      case 'IMAGE': return 'success';
      case 'TEXT_IMAGE': return 'warning';
      default: return 'neutral';
    }
  };

  const getTypeName = (type?: string) => {
    switch (type) {
      case 'TEXT': return 'Văn bản';
      case 'IMAGE': return 'Hình ảnh';
      case 'TEXT_IMAGE': return 'Văn bản + ảnh';
      default: return 'Trống';
    }
  };

  const visibleCount = blocks.filter(b => b.active).length;

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-canvas">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-text">Mô tả chi tiết</h2>
          <Badge variant="neutral">
            {blocks.length} blocks · {visibleCount} hiện
          </Badge>
        </div>
        <Button
          variant={savedMoment ? "success" : "primary"}
          onClick={handleSave}
          loading={saving || uploadingIndex !== null}
          leftIcon={savedMoment ? <Check className="w-4 h-4" /> : undefined}
          className="transition-all duration-300"
        >
          {savedMoment ? 'Đã lưu!' : 'Lưu thay đổi'}
        </Button>
      </div>

      <div className="p-6 space-y-4">
        {blocks.map((block, index) => {
          const isExpanded = expandedIndexes.has(index);

          return (
            <div key={index} className="border border-border rounded-xl bg-canvas overflow-hidden">
              {/* Topbar */}
              <div 
                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-surface transition-colors select-none ${isExpanded ? 'border-b border-border bg-surface' : ''}`}
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleMoveUp(index, e)}
                      disabled={index === 0}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-muted transition-colors"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleMoveDown(index, e)}
                      disabled={index === blocks.length - 1}
                      className="p-1 text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-muted transition-colors"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className="text-sm font-bold text-text w-6">#{index + 1}</span>
                  
                  <Badge variant={getTypeVariant(block.type)}>
                    {getTypeName(block.type)}
                  </Badge>
                  
                  <Badge variant={block.active ? 'success' : 'neutral'}>
                    {block.active ? 'Hiện' : 'Ẩn'}
                  </Badge>

                  <span className="text-sm text-text-muted truncate ml-2 border-l border-border pl-4 max-w-[200px] md:max-w-md hidden sm:block">
                    {getPreviewText(block)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBlock(index);
                    }}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    title="Xoá khối nội dung"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronDown className={`w-5 h-5 text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Body (Form & Preview) */}
              {isExpanded && (
                <div className="p-4 flex flex-col xl:flex-row gap-6 bg-canvas">
                  
                  {/* Left: Form Fields */}
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-text mb-1">Loại nội dung</label>
                        <select
                          value={block.type || 'TEXT'}
                          onChange={(e) => handleChange(index, 'type', e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface"
                        >
                          <option value="TEXT">Văn bản</option>
                          <option value="IMAGE">Hình ảnh</option>
                          <option value="TEXT_IMAGE">Văn bản & Hình ảnh</option>
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium text-text mb-1">Trạng thái</label>
                        <select
                          value={block.active ? 'true' : 'false'}
                          onChange={(e) => handleChange(index, 'active', e.target.value === 'true')}
                          className="w-full h-10 px-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface"
                        >
                          <option value="true">Hiện</option>
                          <option value="false">Ẩn</option>
                        </select>
                      </div>
                    </div>

                    {(block.type === 'TEXT' || block.type === 'TEXT_IMAGE') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Tiêu đề (tuỳ chọn)</label>
                          <input
                            type="text"
                            value={block.title || ''}
                            onChange={(e) => handleChange(index, 'title', e.target.value)}
                            placeholder="Ví dụ: Thiết kế nổi bật..."
                            className="w-full h-10 px-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Nội dung</label>
                          <textarea
                            value={block.content || ''}
                            onChange={(e) => handleChange(index, 'content', e.target.value)}
                            rows={4}
                            placeholder="Nội dung mô tả..."
                            className="w-full p-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface"
                          />
                        </div>
                      </>
                    )}

                    {(block.type === 'IMAGE' || block.type === 'TEXT_IMAGE') && (
                      <div className="space-y-4 pt-2 border-t border-border">
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Hình ảnh</label>
                          {block.imageUrl ? (
                            <div className="relative w-full aspect-video rounded-lg border border-border bg-surface overflow-hidden group/img">
                              <img src={block.imageUrl} alt="" className="w-full h-full object-contain" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <label className="cursor-pointer px-3 py-1.5 bg-white text-text text-sm font-semibold rounded hover:bg-gray-100 transition-colors">
                                  Đổi ảnh
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleImageUpload(index, e.target.files[0]);
                                      }
                                    }} 
                                  />
                                </label>
                                <button
                                  onClick={() => handleChange(index, 'imageUrl', '')}
                                  className="px-3 py-1.5 bg-danger text-white text-sm font-semibold rounded hover:bg-danger-hover transition-colors"
                                >
                                  Xoá
                                </button>
                              </div>
                              {uploadingIndex === index && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                  <span className="text-sm font-bold animate-pulse text-primary">Đang tải...</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer bg-surface transition-colors relative">
                              <ImageIcon className="w-8 h-8 text-muted mb-2" />
                              <span className="text-sm text-text font-medium">Tải ảnh lên</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleImageUpload(index, e.target.files[0]);
                                  }
                                }} 
                              />
                              {uploadingIndex === index && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                                  <span className="text-sm font-bold animate-pulse text-primary">Đang tải...</span>
                                </div>
                              )}
                            </label>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Thẻ Alt (tuỳ chọn)</label>
                          <input
                            type="text"
                            value={block.altText || ''}
                            onChange={(e) => handleChange(index, 'altText', e.target.value)}
                            placeholder="Mô tả ảnh cho SEO..."
                            className="w-full h-10 px-3 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-surface"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Preview Panel */}
                  <div className="xl:w-1/3 border border-border rounded-lg bg-surface p-4 flex flex-col">
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Xem trước</h4>
                    <div className="flex-1 border border-border bg-white rounded-lg p-3 overflow-y-auto max-h-[300px] xl:max-h-full">
                      {(!block.title && !block.content && !block.imageUrl) ? (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-sm italic">
                          Chưa có nội dung
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {(block.type === 'TEXT' || block.type === 'TEXT_IMAGE') && (block.title || block.content) && (
                            <div className="space-y-1">
                              {block.title && <h5 className="font-bold text-sm text-text">{block.title}</h5>}
                              {block.content && <p className="text-xs text-text-muted whitespace-pre-wrap">{block.content}</p>}
                            </div>
                          )}
                          {(block.type === 'IMAGE' || block.type === 'TEXT_IMAGE') && (
                            <div className="w-full bg-surface rounded border border-border flex items-center justify-center overflow-hidden min-h-[100px]">
                              {block.imageUrl ? (
                                <img src={block.imageUrl} alt={block.altText || ''} className="w-full h-auto object-contain" />
                              ) : (
                                <div className="text-xs text-text-muted italic flex items-center gap-1 py-4">
                                  <ImageIcon className="w-4 h-4" /> Hình ảnh trống
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}

        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border rounded-lg bg-[var(--surface-alt)] opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-canvas border border-border rounded-full flex items-center justify-center mb-4 shadow-sm">
              <LayoutTemplate className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-base font-bold text-text mb-1">Chưa có nội dung mô tả</h3>
            <p className="text-sm text-text-muted text-center max-w-sm mb-5">
              Xây dựng trải nghiệm như Landing Page cho sản phẩm của bạn bằng cách kết hợp văn bản và hình ảnh.
            </p>
            <Button 
              variant="outline" 
              leftIcon={<Plus className="w-4 h-4" />} 
              onClick={handleAddBlock}
              className="hover:border-primary hover:text-primary transition-colors"
            >
              Thêm khối đầu tiên
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={handleAddBlock}
            className="mt-2"
          >
            Thêm khối nội dung
          </Button>
        )}
      </div>
    </div>
  );
}
