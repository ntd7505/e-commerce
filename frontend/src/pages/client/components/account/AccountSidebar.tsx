import React from 'react';
import { User as UserIcon, Package, MapPin, Star, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '../../../../features/auth/AuthProvider';

export default function AccountSidebar() {
  const { user, logout } = useAuth();

  if (!user) return null;

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
          <div className="flex items-center gap-3 px-5 py-3 lg:py-3.5 bg-blue-50/50 text-nexa-blue font-semibold lg:border-l-4 lg:border-b-0 border-b-2 border-nexa-blue cursor-default whitespace-nowrap transition-colors">
            <UserIcon className="w-5 h-5 hidden lg:block" />
            Thông tin tài khoản
          </div>
        </li>
        <li className="shrink-0 lg:w-full">
          <div className="flex items-center justify-between px-5 py-3 lg:py-3.5 text-gray-400 cursor-not-allowed lg:border-l-4 lg:border-b-0 border-b-2 border-transparent whitespace-nowrap" aria-disabled="true">
            <div className="flex items-center gap-3">
               <Package className="w-5 h-5 hidden lg:block" />
               Quản lý đơn hàng
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-3">Sắp ra mắt</span>
          </div>
        </li>
        <li className="shrink-0 lg:w-full">
          <div className="flex items-center justify-between px-5 py-3 lg:py-3.5 text-gray-400 cursor-not-allowed lg:border-l-4 lg:border-b-0 border-b-2 border-transparent whitespace-nowrap" aria-disabled="true">
            <div className="flex items-center gap-3">
               <MapPin className="w-5 h-5 hidden lg:block" />
               Sổ địa chỉ
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-3">Sắp ra mắt</span>
          </div>
        </li>
        <li className="shrink-0 lg:w-full">
          <div className="flex items-center justify-between px-5 py-3 lg:py-3.5 text-gray-400 cursor-not-allowed lg:border-l-4 lg:border-b-0 border-b-2 border-transparent whitespace-nowrap" aria-disabled="true">
            <div className="flex items-center gap-3">
               <Star className="w-5 h-5 hidden lg:block" />
               Đánh giá sản phẩm
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-3">Sắp ra mắt</span>
          </div>
        </li>
        <li className="shrink-0 lg:w-full">
          <div className="flex items-center justify-between px-5 py-3 lg:py-3.5 text-gray-400 cursor-not-allowed lg:border-l-4 lg:border-b-0 border-b-2 border-transparent whitespace-nowrap" aria-disabled="true">
            <div className="flex items-center gap-3">
               <Ticket className="w-5 h-5 hidden lg:block" />
               Mã giảm giá
            </div>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-3">Sắp ra mắt</span>
          </div>
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
