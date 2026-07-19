import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { adminHomeBannerApi } from '../../../features/admin/home-banners/adminHomeBannerApi';
import type { HomeBanner } from '../../../features/admin/home-banners/types';
import { BannerPosition } from '../../../features/admin/home-banners/types';
import { Button, Pagination, Badge } from '../../../components/common';
import { useToast } from '../../../features/ui/ToastProvider';
import { AdminEmptyState } from '../../../components/admin/AdminEmptyState';
import { AdminBadge } from '../../../components/admin/AdminBadge';
import HomeBannerFormModal from './components/HomeBannerFormModal';

export default function HomeBanners() {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [positionFilter, setPositionFilter] = useState<BannerPosition | ''>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomeBanner | undefined>();

  const fetchBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminHomeBannerApi.getBanners({
        page,
        size: 10,
        position: positionFilter as BannerPosition || undefined,
      });
      setBanners(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, positionFilter, showToast]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await adminHomeBannerApi.updateBannerStatus(id, { active: !currentStatus });
      showToast('Cập nhật trạng thái thành công', 'success');
      fetchBanners();
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    try {
      await adminHomeBannerApi.deleteBanner(id);
      showToast('Xóa banner thành công', 'success');
      fetchBanners();
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Lỗi khi xóa banner', 'error');
    }
  };

  const handleReorder = async (direction: 'up' | 'down', index: number) => {
    if (positionFilter !== BannerPosition.HOME_HERO) {
      showToast('Chỉ hỗ trợ sắp xếp khi lọc theo Hero', 'error');
      return;
    }
    
    const newBanners = [...banners];
    if (direction === 'up' && index > 0) {
      [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
    } else if (direction === 'down' && index < newBanners.length - 1) {
      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
    } else {
      return;
    }

    try {
      await adminHomeBannerApi.reorderHeroBanners({ bannerIds: newBanners.map((b) => b.id) });
      fetchBanners();
      showToast('Cập nhật thứ tự thành công', 'success');
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Có lỗi xảy ra khi đổi thứ tự', 'error');
    }
  };

  const getPositionLabel = (pos: BannerPosition) => {
    switch (pos) {
      case BannerPosition.HOME_HERO: return 'Hero Slider';
      case BannerPosition.HOME_SIDE_TOP: return 'Bên phải - Trên';
      case BannerPosition.HOME_SIDE_BOTTOM: return 'Bên phải - Dưới';
      default: return pos;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-text">Quản lý Banner Trang chủ</h1>
          <p className="mt-1 text-sm text-text-muted">Tùy chỉnh banner hiển thị trên trang chủ client</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditingBanner(undefined);
            setIsModalOpen(true);
          }}
        >
          Thêm Banner mới
        </Button>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text">Vị trí:</label>
          <select
            value={positionFilter}
            onChange={(e) => {
              setPositionFilter(e.target.value as BannerPosition | '');
              setPage(0);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-primary"
          >
            <option value="">Tất cả</option>
            <option value={BannerPosition.HOME_HERO}>Hero Slider</option>
            <option value={BannerPosition.HOME_SIDE_TOP}>Bên phải - Trên</option>
            <option value={BannerPosition.HOME_SIDE_BOTTOM}>Bên phải - Dưới</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text">
            <thead className="bg-surface-alt font-medium text-text-muted border-b border-border">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Vị trí</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-center">Sắp xếp</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">Đang tải...</td>
                </tr>
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8">
                    <AdminEmptyState
                      icon={ImageIcon}
                      title="Chưa có banner nào"
                      description="Hãy thêm banner để quảng cáo sản phẩm trên trang chủ"
                    />
                  </td>
                </tr>
              ) : (
                banners.map((banner, index) => (
                  <tr key={banner.id} className="hover:bg-surface-alt/50">
                    <td className="px-6 py-4">
                      <div className="h-16 w-32 overflow-hidden rounded-lg border border-border bg-surface-alt">
                        {banner.imageUrl ? (
                          <img src={banner.imageUrl} alt={banner.title || ''} className="h-full w-full object-cover" />
                        ) : banner.product.thumbnailUrl ? (
                          <img src={banner.product.thumbnailUrl} alt="Thumbnail" className="h-full w-full object-cover" />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center text-xs text-text-muted"
                            style={{ backgroundColor: banner.backgroundColor || '#f3f4f6' }}
                          >
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text line-clamp-2 max-w-[200px]">
                        {banner.product.name}
                      </div>
                      <div className="text-xs text-text-muted mt-1">{banner.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="neutral">{getPositionLabel(banner.position)}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(banner.id, banner.active)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          banner.active ? 'bg-success' : 'bg-border-strong'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            banner.active ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {positionFilter === BannerPosition.HOME_HERO && (
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleReorder('up', index)}
                            disabled={index === 0}
                            className="rounded p-1 text-text-muted hover:bg-border hover:text-text disabled:opacity-30"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReorder('down', index)}
                            disabled={index === banners.length - 1}
                            className="rounded p-1 text-text-muted hover:bg-border hover:text-text disabled:opacity-30"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingBanner(banner);
                            setIsModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-text-muted hover:bg-primary-soft hover:text-primary transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="rounded-lg p-2 text-text-muted hover:bg-danger-soft hover:text-danger transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-t border-border p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <HomeBannerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={editingBanner}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchBanners();
        }}
      />
    </div>
  );
}
