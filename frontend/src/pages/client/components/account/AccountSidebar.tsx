import { User as UserIcon, Package, MapPin, Star, Ticket, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../features/auth/AuthProvider';

import { canAccessAdmin, getFirstAdminRoute } from '../../../../features/auth/authHelpers';

type ActiveKey = 'profile' | 'orders' | 'addresses' | 'reviews' | 'coupons';

function resolveActiveKey(pathname: string): ActiveKey {
  if (pathname.startsWith('/account/orders')) return 'orders';
  if (pathname.startsWith('/account/addresses')) return 'addresses';
  if (pathname.startsWith('/account/reviews')) return 'reviews';
  if (pathname.startsWith('/account/coupons')) return 'coupons';
  return 'profile';
}

export default function AccountSidebar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const active = resolveActiveKey(pathname);

  if (!user) return null;

  const showAdminLink = canAccessAdmin(user);
  const adminRoute = getFirstAdminRoute(user);

  const baseItem =
    'flex items-center gap-3 px-5 py-3 lg:py-3.5 lg:rounded-lg lg:border-b-0 border-b-2 whitespace-nowrap transition-colors';
  const activeItem = `${baseItem} bg-primary-soft text-primary font-semibold cursor-default`;
  const idleItem = `${baseItem} text-muted font-medium hover:text-primary hover:bg-primary-soft/40 border-transparent cursor-pointer`;

  return (
    <div className="w-full lg:w-64 shrink-0 bg-surface rounded-2xl shadow-sm shadow-primary/5 border border-primary/10 overflow-hidden flex flex-col">
      <div className="hidden lg:flex p-5 border-b border-border items-center gap-4 bg-surface/50">
        <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center overflow-hidden shrink-0 border-2 border-border-strong shadow-sm">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-7 h-7 text-muted" />
          )}
        </div>
        <div className="overflow-hidden">
          <div className="text-xs text-muted font-medium mb-0.5">Tài khoản của</div>
          <div className="font-bold text-text truncate">{user.fullName}</div>
        </div>
      </div>
      
      <ul className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible py-2 lg:py-3 scrollbar-hide">
        <li className="shrink-0 lg:w-full">
          <Link
            to="/account"
            className={active === 'profile' ? activeItem : idleItem}
            aria-current={active === 'profile' ? 'page' : undefined}
          >
            <UserIcon className="w-5 h-5 hidden lg:block" />
            Thông tin tài khoản
          </Link>
        </li>
        <li className="shrink-0 lg:w-full">
          <Link
            to="/account/orders"
            className={active === 'orders' ? activeItem : idleItem}
            aria-current={active === 'orders' ? 'page' : undefined}
          >
            <Package className="w-5 h-5 hidden lg:block" />
            Quản lý đơn hàng
          </Link>
        </li>
        <li className="shrink-0 lg:w-full">
          <Link
            to="/account/addresses"
            className={active === 'addresses' ? activeItem : idleItem}
            aria-current={active === 'addresses' ? 'page' : undefined}
          >
            <MapPin className="w-5 h-5 hidden lg:block" />
            Sổ địa chỉ
          </Link>
        </li>
        <li className="shrink-0 lg:w-full">
          <Link
            to="/account/reviews"
            className={active === 'reviews' ? activeItem : idleItem}
            aria-current={active === 'reviews' ? 'page' : undefined}
          >
            <Star className="w-5 h-5 hidden lg:block" />
            Đánh giá sản phẩm
          </Link>
        </li>
        <li className="shrink-0 lg:w-full">
          <Link
            to="/account/coupons"
            className={active === 'coupons' ? activeItem : idleItem}
            aria-current={active === 'coupons' ? 'page' : undefined}
          >
            <Ticket className="w-5 h-5 hidden lg:block" />
            Mã giảm giá
          </Link>
        </li>
        {showAdminLink && (
          <li className="shrink-0 lg:w-full lg:border-t border-border lg:mt-3 lg:pt-3">
            <Link
              to={adminRoute}
              className={idleItem}
            >
              <ShieldCheck className="w-5 h-5 hidden lg:block" />
              Trang quản trị
            </Link>
          </li>
        )}
        <li className={`shrink-0 lg:w-full ${showAdminLink ? '' : 'lg:border-t border-border lg:mt-3 lg:pt-3'}`}>
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-5 py-3 lg:py-3.5 lg:rounded-lg text-muted font-medium hover:text-danger hover:bg-danger-soft transition-colors lg:border-b-0 border-b-2 border-transparent text-left cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:bg-danger-soft"
            aria-label="Đăng xuất khỏi tài khoản"
          >
            <LogOut className="w-5 h-5 hidden lg:block" />
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
}
