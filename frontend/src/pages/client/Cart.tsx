import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/client/cart/CartProvider';
import CartItemCard from './components/cart/CartItemCard';
import { formatCurrency } from '../../utils/formatters';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function Cart() {
  const { cart, loading, error, updateItem, removeItem, refreshCart } = useCart();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Lọc bỏ những item không còn tồn tại trong cart khỏi selectedIds
  useEffect(() => {
    if (cart) {
      const validIds = new Set(cart.items.map(item => item.id));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIds(prev => {
        const next = new Set(prev);
        for (const id of next) {
          if (!validIds.has(id)) {
            next.delete(id);
          }
        }
        return next;
      });
    }
  }, [cart]);

  const items = useMemo(() => cart?.items || [], [cart?.items]);
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map(i => i.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Bạn có chắc muốn xoá ${selectedIds.size} mục đã chọn?`)) {
      // Vì backend api delete từng cái (trừ clearCart xoá hết), ta xoá song song hoặc từng cái
      try {
        await Promise.all(Array.from(selectedIds).map(id => removeItem(id)));
      } catch (err) {
        console.error('Lỗi khi xoá nhiều mục', err);
      }
    }
  };

  const selectedSubtotal = useMemo(() => {
    return items
      .filter(item => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.lineTotal, 0);
  }, [items, selectedIds]);

  const handleCheckout = () => {
    if (selectedIds.size === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }
    const payload = {
      cartItemIds: Array.from(selectedIds),
    };
    sessionStorage.setItem('checkoutDraft', JSON.stringify(payload));
    navigate('/checkout');
  };

  if (loading && !cart) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingState /></div>;
  }

  if (error && !cart) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ErrorState message={error} />
        <button onClick={() => refreshCart()} className="text-blue-600 hover:underline">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f7f8] min-h-screen pb-20">
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-10">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 py-4">
          <Link to="/" className="text-gray-500 text-sm font-medium hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span className="text-gray-500 text-sm font-medium">/</span>
          <span className="text-gray-900 text-sm font-medium">Giỏ hàng</span>
        </div>
        
        <div className="flex flex-wrap justify-between gap-3 pb-6 pt-2">
          <h1 className="text-gray-900 text-2xl md:text-3xl font-black leading-tight tracking-[-0.033em]">
            Giỏ hàng của bạn ({cart?.totalItems || 0})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center shadow-sm text-center">
            <div className="w-32 h-32 mb-6">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn còn trống</h3>
            <p className="text-gray-500 mb-6">Hãy tìm thêm các sản phẩm công nghệ tuyệt vời khác nhé!</p>
            <Link to="/products" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side: Cart Items */}
            <div className="flex-1">
              {/* Bulk Actions */}
              <div className="bg-white rounded-xl px-6 py-4 mb-4 flex items-center justify-between border border-gray-100 shadow-sm">
                <label className="flex items-center gap-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 border-2 text-blue-600 focus:ring-0 transition-all cursor-pointer"
                  />
                  <span className="text-gray-900 text-sm font-medium group-hover:text-blue-600 transition-colors">Chọn tất cả</span>
                </label>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-500 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  <span className="hidden sm:inline">Xóa mục đã chọn</span>
                </button>
              </div>

              {/* Item List */}
              <div className="flex flex-col gap-4">
                {items.map(item => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedIds.has(item.id)}
                    onSelect={handleSelectItem}
                    onUpdateQuantity={(id, quantity) => updateItem(id, { quantity })}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Summary */}
            <div className="w-full lg:w-[360px] xl:w-[400px] flex-shrink-0">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm sticky top-[100px]">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Thanh toán</h2>
                
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-gray-500">Tạm tính ({selectedIds.size} sản phẩm)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(selectedSubtotal)}</span>
                </div>
                
                <div className="border-t border-gray-100 my-4"></div>
                
                <div className="flex justify-between items-end mb-6">
                  <span className="font-bold text-gray-900">Tổng cộng</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">{formatCurrency(selectedSubtotal)}</span>
                    <p className="text-[11px] text-gray-400 mt-1">(Đã bao gồm VAT nếu có)</p>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedIds.size === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  MUA HÀNG ({selectedIds.size})
                </button>
                <p className="text-center text-[11px] text-gray-500 mt-3 italic">
                  Nhấn "Mua hàng" để chuyển đến bước thanh toán bảo mật.
                </p>

                {/* Trust Badges */}
                <div className="mt-8 flex items-center justify-center gap-6 opacity-60 border-t border-gray-50 pt-6">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <i className="fa-solid fa-shield-halved text-2xl"></i>
                    <span className="text-[10px] font-bold uppercase">Bảo mật</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <i className="fa-solid fa-rotate-left text-2xl"></i>
                    <span className="text-[10px] font-bold uppercase">Đổi trả 30 ngày</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <i className="fa-solid fa-headset text-2xl"></i>
                    <span className="text-[10px] font-bold uppercase">Hỗ trợ 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
