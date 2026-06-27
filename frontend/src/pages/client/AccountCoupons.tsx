import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Gift, Tag, Calendar, CheckCircle2, Copy, ShoppingCart, Info } from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';
import type { ClientCoupon, CouponCategory } from '../../features/client/coupons/couponTypes';
import { useToast } from '../../features/ui/ToastProvider';
import { formatDate, formatVnd } from '../../utils/formatters';

// TODO: Replace local coupon samples with client coupon API when available.
// There is currently no client coupon list endpoint. These are local samples only.
const SAMPLE_COUPONS: ClientCoupon[] = [
  {
    id: 's1',
    code: 'NEXA5',
    title: 'Giảm 5% đơn từ 5 triệu',
    description: 'Áp dụng cho mọi đơn hàng từ 5.000.000₫ trở lên.',
    category: 'NEXAMART',
    expiresAt: '2025-12-31',
    status: 'ACTIVE',
    minOrderAmount: 5_000_000,
    discountValue: 5,
    discountType: 'PERCENT',
  },
  {
    id: 's2',
    code: 'FREESHIP50',
    title: 'Miễn phí vận chuyển',
    description: 'Miễn ship cho đơn từ 300.000₫.',
    category: 'SHIPPING',
    expiresAt: '2025-12-31',
    status: 'ACTIVE',
    minOrderAmount: 300_000,
  },
  {
    id: 's3',
    code: 'BANK100',
    title: 'Giảm 100k khi thanh toán chuyển khoản',
    description: 'Giảm trực tiếp 100.000₫ khi thanh toán qua chuyển khoản.',
    category: 'PAYMENT',
    expiresAt: '2025-09-30',
    status: 'ACTIVE',
    minOrderAmount: 1_000_000,
    discountValue: 100_000,
    discountType: 'FIXED_AMOUNT',
  },
  {
    id: 's4',
    code: 'WELCOME10',
    title: 'Giảm 10% khách hàng mới',
    description: 'Ưu đãi chào mừng, tối đa 200.000₫.',
    category: 'NEXAMART',
    expiresAt: '2025-08-31',
    status: 'EXPIRED',
    minOrderAmount: 200_000,
    discountValue: 10,
    discountType: 'PERCENT',
  },
  {
    id: 's5',
    code: 'MOMO50',
    title: 'Hoàn 50k khi thanh toán MoMo',
    description: 'Hoàn tiền vào ví MoMo cho đơn từ 500.000₫.',
    category: 'PAYMENT',
    expiresAt: '2025-10-15',
    status: 'ACTIVE',
    minOrderAmount: 500_000,
    discountValue: 50_000,
    discountType: 'FIXED_AMOUNT',
  },
];

const CATEGORY_TABS: { key: 'ALL' | CouponCategory; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'NEXAMART', label: 'NexaMart' },
  { key: 'PAYMENT', label: 'Thanh toán' },
  { key: 'SHIPPING', label: 'Vận chuyển' },
];

const categoryIcon: Record<CouponCategory, typeof Ticket> = {
  NEXAMART: Ticket,
  PAYMENT: Gift,
  SHIPPING: Tag,
};

const categoryColor: Record<CouponCategory, string> = {
  NEXAMART: 'bg-blue-100 text-blue-600',
  PAYMENT: 'bg-violet-100 text-violet-600',
  SHIPPING: 'bg-emerald-100 text-emerald-600',
};

const statusStyle: Record<ClientCoupon['status'], string> = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  EXPIRED: 'border-gray-200 bg-gray-50 text-gray-500',
  USED: 'border-amber-200 bg-amber-50 text-amber-700',
};

const statusLabel: Record<ClientCoupon['status'], string> = {
  ACTIVE: 'Đang dùng',
  EXPIRED: 'Hết hạn',
  USED: 'Đã sử dụng',
};

function CouponCard({ coupon, onUse }: { coupon: ClientCoupon; onUse: (code: string) => void }) {
  const Icon = categoryIcon[coupon.category];
  const inactive = coupon.status !== 'ACTIVE';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex">
        {/* Left brand block */}
        <div className={`w-20 shrink-0 flex items-center justify-center ${categoryColor[coupon.category]} ${inactive ? 'opacity-40' : ''}`}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-gray-900">{coupon.title}</h3>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusStyle[coupon.status]}`}>
              {statusLabel[coupon.status]}
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-3">{coupon.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 border border-dashed border-gray-300 px-2.5 py-1 text-sm font-bold text-blue-600">
              {coupon.code}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Hết hạn: {formatDate(coupon.expiresAt)}
            </span>
            {coupon.minOrderAmount && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Info className="w-3.5 h-3.5 text-gray-400" />
                Đơn tối thiểu: {formatVnd(coupon.minOrderAmount)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onUse(coupon.code)}
              disabled={inactive}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              {inactive ? 'Không khả dụng' : 'Dùng ngay'}
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Đi tới giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountCoupons() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<'ALL' | CouponCategory>('ALL');
  const [inputCode, setInputCode] = useState('');

  const filteredCoupons = useMemo(() => {
    if (activeCategory === 'ALL') return SAMPLE_COUPONS;
    return SAMPLE_COUPONS.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  function handleApplyCode() {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      showToast('Vui lòng nhập mã giảm giá.', 'error');
      return;
    }
    // Save to sessionStorage checkoutDraft so checkout can pick it up
    const draftStr = sessionStorage.getItem('checkoutDraft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        sessionStorage.setItem('checkoutDraft', JSON.stringify({ ...draft, couponCode: code }));
      } catch {
        sessionStorage.setItem('checkoutDraft', JSON.stringify({ cartItemIds: [], couponCode: code }));
      }
    } else {
      sessionStorage.setItem('checkoutDraft', JSON.stringify({ cartItemIds: [], couponCode: code }));
    }
    showToast(`Đã áp dụng mã "${code}". Mã sẽ dùng ở bước thanh toán.`, 'success', {
      label: 'Đi tới giỏ hàng',
      to: '/cart',
    });
    setInputCode('');
  }

  function handleUseCoupon(code: string) {
    const upper = code.toUpperCase();
    const draftStr = sessionStorage.getItem('checkoutDraft');
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        sessionStorage.setItem('checkoutDraft', JSON.stringify({ ...draft, couponCode: upper }));
      } catch {
        sessionStorage.setItem('checkoutDraft', JSON.stringify({ cartItemIds: [], couponCode: upper }));
      }
    } else {
      sessionStorage.setItem('checkoutDraft', JSON.stringify({ cartItemIds: [], couponCode: upper }));
    }
    showToast(`Đã sao chép và áp dụng mã "${upper}".`, 'success', {
      label: 'Đi tới giỏ hàng',
      onClick: () => navigate('/cart'),
    });
  }

  return (
    <AccountPageLayout
      breadcrumbCurrent="Mã giảm giá"
      title="Mã giảm giá"
      description="Lưu và sử dụng mã ưu đãi cho đơn hàng NexaMart."
    >
      {/* Coupon input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApplyCode();
            }}
            placeholder="Nhập mã giảm giá"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100 uppercase"
          />
          <button
            type="button"
            onClick={handleApplyCode}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Áp dụng
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Mã sẽ được lưu và áp dụng tự động ở bước thanh toán.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-100 mb-6 overflow-x-auto scrollbar-hide">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeCategory === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coupon list */}
      {filteredCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Ticket className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Bạn chưa có mã giảm giá nào.</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Khi có mã ưu đãi, chúng sẽ xuất hiện tại đây để bạn sử dụng.
          </p>
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} onUse={handleUseCoupon} />
          ))}
        </div>
      )}
    </AccountPageLayout>
  );
}