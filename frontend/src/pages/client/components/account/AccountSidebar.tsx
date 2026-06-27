import { User as UserIcon, Package, MapPin, Star, Ticket, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../features/auth/AuthProvider';

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

  const baseItem =
    'flex items-center gap-3 px-5 py-3 lg:py-3.5 lg:border-l-4 lg:border-b-0 border-b-2 whitespace-nowrap transition-colors';
  const activeItem = `${baseItem} bg-blue-50/50 text-nexa-blue font-semibold border-nexa-blue cursor-default`;
  const idleItem = `${baseItem} text-gray-600 font-medium hover:text-nexa-blue hover:bg-blue-50/40 border-transparent cursor-pointer`;

  return (
    <div className="w-full lg:w-64 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="hidden lg:flex p-5 border-b border-gray-100 items-center gap-4 bg-gray-50/50">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0 border-2 border-gray-200 shadow-sm">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-7 h-7 text-gray-400" />
          )}
        </div>
        <div className="overflow-hidden">
          <div className="text-xs text-gray-500 font-medium mb-0.5">Tài khoản của</div>
          <div className="font-bold text-gray-900 truncate">{user.fullName}</div>
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
        <li className="shrink-0 lg:w-full lg:border-t border-gray-100 lg:mt-3 lg:pt-3">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-5 py-3 lg:py-3.5 text-gray-600 font-medium hover:text-red-600 hover:bg-red-50 transition-colors lg:border-l-4 lg:border-b-0 border-b-2 border-transparent text-left cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:bg-red-50"
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
