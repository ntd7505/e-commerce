import { useEffect, useState } from 'react';
import { X, Image as ImageIcon, Search, Loader2 } from 'lucide-react';

import { Button } from '../../../../components/common';
import { adminHomeBannerApi } from '../../../../features/admin/home-banners/adminHomeBannerApi';
import { getProducts } from '../../../../features/admin/products/adminProductApi';
import type { HomeBanner, HomeBannerRequest } from '../../../../features/admin/home-banners/types';
import { BannerPosition } from '../../../../features/admin/home-banners/types';
import type { ProductResponse } from '../../../../features/admin/products/adminProductTypes';
import { uploadImage } from '../../../../utils/imageUpload';
import { useToast } from '../../../../features/ui/ToastProvider';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  banner?: HomeBanner;
  onSuccess: () => void;
}

export default function HomeBannerFormModal({ isOpen, onClose, banner, onSuccess }: Props) {
  const { showToast } = useToast();
  const isEditing = !!banner;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(null);

  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<ProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

  // Form state
  const [productId, setProductId] = useState<number>(0);
  const [position, setPosition] = useState<BannerPosition>(BannerPosition.HOME_HERO);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [active, setActive] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (banner) {
        setProductId(banner.product.id);
        setPosition(banner.position);
        setTitle(banner.title || '');
        setSubtitle(banner.subtitle || '');
        setBackgroundColor(banner.backgroundColor || '');
        setActive(banner.active);
        setStartsAt(banner.startsAt ? new Date(banner.startsAt).toISOString().slice(0, 16) : '');
        setEndsAt(banner.endsAt ? new Date(banner.endsAt).toISOString().slice(0, 16) : '');

        setImagePreview(banner.imageUrl || null);
        setMobileImagePreview(banner.mobileImageUrl || null);
        setProductSearch(banner.product.name);
      } else {
        setProductId(0);
        setPosition(BannerPosition.HOME_HERO);
        setTitle('');
        setSubtitle('');
        setBackgroundColor('');
        setActive(false);
        setStartsAt('');
        setEndsAt('');

        setImagePreview(null);
        setMobileImagePreview(null);
        setProductSearch('');
      }
      setImageFile(null);
      setMobileImageFile(null);
      setSelectedProduct(null);

      // Fetch products for dropdown
      getProducts().then(products => {
        setAllProducts(products.filter(p => p.active));
      }).catch(console.error);

    } else {
      setAllProducts([]);
      setIsDropdownOpen(false);
    }
  }, [isOpen, banner]);

  useEffect(() => {
    if (!isDropdownOpen) {
      setSearchResults([]);
      return;
    }

    setIsSearchingProduct(true);

    // Delay vài giây (1.5s) theo yêu cầu để tránh query liên tục
    const timeout = setTimeout(() => {
      const filtered = allProducts
        .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
        .slice(0, 15);

      setSearchResults(filtered);
      setIsSearchingProduct(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [productSearch, isDropdownOpen, allProducts]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isMobile: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isMobile) {
        setMobileImageFile(file);
        setMobileImagePreview(URL.createObjectURL(file));
      } else {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      showToast('Vui lòng chọn sản phẩm', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      let imageUrl = banner?.imageUrl || '';
      let mobileImageUrl = banner?.mobileImageUrl || '';

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, { folder: 'ecommerce/banners' });
      }
      if (mobileImageFile) {
        mobileImageUrl = await uploadImage(mobileImageFile, { folder: 'ecommerce/banners' });
      }

      const request: HomeBannerRequest = {
        productId,
        position,
        title: title || undefined,
        subtitle: subtitle || undefined,
        backgroundColor: backgroundColor || undefined,
        active,
        startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        imageUrl: imageUrl || undefined,
        mobileImageUrl: mobileImageUrl || undefined,
      };

      if (isEditing) {
        await adminHomeBannerApi.updateBanner(banner.id, request);
        showToast('Cập nhật banner thành công', 'success');
      } else {
        await adminHomeBannerApi.createBanner(request);
        showToast('Thêm mới banner thành công', 'success');
      }
      onSuccess();
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-surface p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-text">
            {isEditing ? 'Cập nhật Banner' : 'Thêm mới Banner'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-muted hover:bg-surface-alt hover:text-text"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Sản phẩm liên kết <span className="text-danger">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={productSearch}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  if (selectedProduct) setSelectedProduct(null);
                  setIsDropdownOpen(true);
                }}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Tìm kiếm sản phẩm..."
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-text-muted" />
              {isSearchingProduct && (
                <div className="absolute right-10 top-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              )}

              {isDropdownOpen && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-surface shadow-lg">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="cursor-pointer px-4 py-2 text-sm hover:bg-surface-alt"
                      onClick={() => {
                        setSelectedProduct(product);
                        setProductSearch(product.name);
                        setProductId(product.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Vị trí <span className="text-danger">*</span></label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as BannerPosition)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={BannerPosition.HOME_HERO}>Hero (Slider chính)</option>
                <option value={BannerPosition.HOME_SIDE_TOP}>Bên phải - Trên</option>
                <option value={BannerPosition.HOME_SIDE_BOTTOM}>Bên phải - Dưới</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">Màu nền (tuỳ chọn)</label>
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#FFFFFF"
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Tiêu đề (ghi đè tên SP)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">Phụ đề</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">Thời gian kết thúc</label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-text">Ảnh Desktop (tuỳ chọn)</label>
              <div className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border hover:border-primary">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-text-muted">
                    <ImageIcon className="mx-auto h-8 w-8" />
                    <span className="text-xs">Tải ảnh lên</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, false)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-text">Ảnh Mobile (tuỳ chọn)</label>
              <div className="relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border hover:border-primary">
                {mobileImagePreview ? (
                  <img src={mobileImagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-text-muted">
                    <ImageIcon className="mx-auto h-8 w-8" />
                    <span className="text-xs">Tải ảnh lên</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, true)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="active" className="text-sm font-medium text-text">
              Kích hoạt hiển thị
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting} leftIcon={isSubmitting ? <Loader2 className="animate-spin" /> : undefined}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Banner'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
