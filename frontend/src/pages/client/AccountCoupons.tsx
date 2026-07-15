import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Gift, Tag, Calendar, CheckCircle2, Copy, ShoppingCart, Info } from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';
import type { ClientCoupon, CouponCategory } from '../../features/client/coupons/couponTypes';
import { cartApi } from '../../features/client/cart/cartApi';
import { useToast } from '../../features/ui/ToastProvider';
import { formatDate, formatVnd } from '../../utils/formatters';

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
  NEXAMART: 'bg-primary-soft text-primary',
  PAYMENT: 'bg-violet-100 text-violet-600',
  SHIPPING: 'bg-success-soft text-success',
};

const statusStyle: Record<ClientCoupon['status'], string> = {
  ACTIVE: 'border-success-soft bg-success-soft text-success',
  EXPIRED: 'border-border-strong bg-surface text-muted',
  USED: 'border-warning-soft bg-warning-soft text-warning',
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
    <div className="bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex">
        {/* Left brand block */}
        <div className={`w-20 shrink-0 flex items-center justify-center ${categoryColor[coupon.category]} ${inactive ? 'opacity-40' : ''}`}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-text">{coupon.title}</h3>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusStyle[coupon.status]}`}>
              {statusLabel[coupon.status]}
            </span>
          </div>

          <p className="text-sm text-muted leading-relaxed mb-3">{coupon.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface border border-dashed border-border-strong px-2.5 py-1 text-sm font-bold text-primary">
              {coupon.code}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              Hết hạn: {formatDate(coupon.expiresAt)}
            </span>
            {coupon.minOrderAmount && (
              <span className="inline-flex items-center gap-1 text-xs text-muted">
                <Info className="w-3.5 h-3.5 text-muted" />
                Đơn tối thiểu: {formatVnd(coupon.minOrderAmount)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onUse(coupon.code)}
              disabled={inactive}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              {inactive ? 'Không khả dụng' : 'Dùng ngay'}
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-text bg-surface hover:bg-surface-alt transition-colors"
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
  
  const [coupons, setCoupons] = useState<ClientCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const data = await cartApi.getAvailableCoupons();
        if (mounted) {
          const mapped: ClientCoupon[] = data.map(c => ({
            id: c.code, // use code as id
            code: c.code,
            title: c.description || c.code,
            description: c.description || '',
            category: c.code.toUpperCase().includes('SHIP') ? 'SHIPPING' : (c.code.toUpperCase().includes('BANK') || c.code.toUpperCase().includes('MOMO') || c.code.toUpperCase().includes('VNPAY') ? 'PAYMENT' : 'NEXAMART'),
            expiresAt: c.endDate,
            status: 'ACTIVE',
            minOrderAmount: c.minOrderAmount,
            discountValue: c.discountValue,
            discountType: c.discountType === 'PERCENTAGE' ? 'PERCENT' : 'FIXED_AMOUNT',
          }));
          setCoupons(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void fetchCoupons();
    return () => { mounted = false; };
  }, []);

  const filteredCoupons = useMemo(() => {
    if (activeCategory === 'ALL') return coupons;
    return coupons.filter((c) => c.category === activeCategory);
  }, [activeCategory, coupons]);

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
            className="flex-1 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-soft uppercase"
          />
          <button
            type="button"
            onClick={handleApplyCode}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Áp dụng
          </button>
        </div>
        <p className="mt-2 text-xs text-muted">
          Mã sẽ được lưu và áp dụng tự động ở bước thanh toán.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-6 overflow-x-auto scrollbar-hide">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveCategory(tab.key)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeCategory === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coupon list */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-surface/50 rounded-2xl border border-border border-dashed">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center shadow-sm mb-4">
            <Ticket className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-1">Bạn chưa có mã giảm giá nào.</h3>
          <p className="text-muted max-w-sm mx-auto mb-6">
            Khi có mã ưu đãi, chúng sẽ xuất hiện tại đây để bạn sử dụng.
          </p>
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors"
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