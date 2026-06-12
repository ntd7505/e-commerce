import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingCart, Users, Ticket, LayoutGrid, CreditCard, Award,
  PlusSquare, Image as ImageIcon, ClipboardList, MessageSquare,
  UserCog, ShieldCheck, Bell, LogOut, ExternalLink, Menu,
  ChevronLeft, ChevronDown, Settings, X, Package
} from 'lucide-react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getStoredUser } from '../../features/auth/authStorage';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  collapsed?: boolean;
  alsoMatch?: RegExp;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, collapsed, alsoMatch }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (alsoMatch ? alsoMatch.test(location.pathname) : false);

  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      className={`flex items-center rounded-lg mb-0.5 transition-all duration-200 ${
        collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'
      } ${
        isActive
          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className={`shrink-0 ${collapsed ? 'w-5 h-5' : 'w-4 h-4 mr-3'}`} />
      {!collapsed && <span className="text-[13px] font-semibold truncate">{label}</span>}
    </Link>
  );
};

type SidebarGroupProps = {
  icon: React.ElementType;
  label: string;
  groupPrefix: string;
  children: React.ReactNode;
  collapsed?: boolean;
};

const SidebarGroup: React.FC<SidebarGroupProps> = ({ icon: Icon, label, groupPrefix, children, collapsed }) => {
  const location = useLocation();
  const isGroupActive = location.pathname.startsWith(groupPrefix);
  const [manualExpanded, setManualExpanded] = useState(true);
  const expanded = isGroupActive || manualExpanded;

  if (collapsed) {
    return (
      <div className="relative group mb-0.5">
        <button
          type="button"
          onClick={() => setManualExpanded((e) => !e)}
          title={label}
          className={`w-full flex items-center justify-center px-2 py-2.5 rounded-lg transition-all duration-200 ${
            isGroupActive
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Icon className="w-5 h-5 shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={() => setManualExpanded((e) => !e)}
        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isGroupActive
            ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <Icon className="w-4 h-4 mr-3 shrink-0" />
        <span className="text-[13px] font-semibold truncate flex-1 text-left">{label}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded && (
        <div className="ml-3 mt-1 border-l-2 border-slate-100 pl-2">
          {children}
        </div>
      )}
    </div>
  );
};

type NotifItem = { id: number; text: string; time: string; read: boolean };

const MOCK_NOTIFICATIONS: NotifItem[] = [
  { id: 1, text: "Đơn hàng #1042 vừa được đặt", time: "2 phút trước", read: false },
  { id: 2, text: "Yêu cầu hủy đơn #1039 cần xử lý", time: "15 phút trước", read: false },
  { id: 3, text: "Sản phẩm \"Laptop Dell\" sắp hết hàng", time: "1 giờ trước", read: true },
  { id: 4, text: "Khách hàng mới đăng ký tài khoản", time: "2 giờ trước", read: true },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : 'Dealport';
  const displayEmail = user?.email ?? 'admin';
  const pageTitle = getPageTitle(location.pathname);

  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notification panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-hidden transition-all duration-300 ${
          collapsed ? 'w-[60px]' : 'w-64'
        }`}
      >
        {/* Logo + collapse button */}
        <div className={`flex items-center border-b border-slate-100 shrink-0 h-[72px] ${collapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-sm">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-[17px] text-slate-800 tracking-tight">
                Dealport
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={`p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors ${collapsed ? '' : ''}`}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="mb-4">
            {!collapsed && (
              <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Main
              </p>
            )}
            <SidebarItem collapsed={collapsed} to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem collapsed={collapsed} to="/admin/orders" icon={ShoppingCart} label="Orders" />
            <SidebarItem collapsed={collapsed} to="/admin/customers" icon={Users} label="Customers" />
            <SidebarItem collapsed={collapsed} to="/admin/coupons" icon={Ticket} label="Coupons" />
            <SidebarItem collapsed={collapsed} to="/admin/categories" icon={LayoutGrid} label="Categories" />
            <SidebarItem collapsed={collapsed} to="/admin/transactions" icon={CreditCard} label="Transactions" />
            <SidebarItem collapsed={collapsed} to="/admin/brands" icon={Award} label="Brands" />
          </nav>

          <nav className="mb-4">
            {!collapsed && (
              <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Products
              </p>
            )}
            <SidebarGroup
              collapsed={collapsed}
              icon={Package}
              label="Products"
              groupPrefix="/admin/products"
            >
              <SidebarItem collapsed={collapsed} to="/admin/products/add" icon={PlusSquare} label="Add Product" />
              <SidebarItem collapsed={collapsed} to="/admin/products/media" icon={ImageIcon} label="Media" />
              <SidebarItem
                collapsed={collapsed}
                to="/admin/products"
                icon={ClipboardList}
                label="Product List"
                alsoMatch={/^\/admin\/products\/\d+\/edit$/}
              />
              <SidebarItem collapsed={collapsed} to="/admin/products/reviews" icon={MessageSquare} label="Reviews" />
            </SidebarGroup>
          </nav>

          <nav className="mb-4">
            {!collapsed && (
              <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Admin
              </p>
            )}
            <SidebarItem collapsed={collapsed} to="/admin/roles" icon={UserCog} label="Roles" />
            <SidebarItem collapsed={collapsed} to="/admin/authority" icon={ShieldCheck} label="Authority" />
            <SidebarItem collapsed={collapsed} to="/admin/settings" icon={Settings} label="Settings" />
          </nav>
        </div>

        {/* Footer user profile */}
        <div className={`border-t border-slate-100 shrink-0 bg-white ${collapsed ? 'p-2' : 'p-4'}`}>
          {collapsed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 px-2 py-2 mb-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[14px] shrink-0">
                  {displayName[0]?.toUpperCase() ?? 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{displayEmail}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/profile')}
                className="w-full flex items-center justify-between px-3 py-2 text-[13px] font-semibold border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Your Profile
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <h1 className="text-lg font-bold text-slate-800">{pageTitle}</h1>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-[13px] font-bold text-slate-800">Notifications</p>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((item) => item.id === n.id ? { ...item, read: true } : item)
                          )
                        }
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 ${!n.read ? 'bg-emerald-50/40' : ''}`}
                      >
                        <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${!n.read ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        <div>
                          <p className={`text-[12px] leading-relaxed ${!n.read ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                            {n.text}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-400">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-emerald-100 text-[14px] font-bold text-emerald-700 border border-emerald-200 transition-colors hover:bg-emerald-200"
              onClick={() => navigate('/admin/profile')}
            >
              {displayName[0]?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function getPageTitle(pathname: string) {
  const titleMap: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/orders': 'Order Management',
    '/admin/customers': 'Customers',
    '/admin/coupons': 'Coupon Codes',
    '/admin/categories': 'Categories',
    '/admin/transactions': 'Transactions',
    '/admin/brands': 'Brands',
    '/admin/products/add': 'Add Product',
    '/admin/products/media': 'Product Media',
    '/admin/products/reviews': 'Product Reviews',
    '/admin/products': 'Products',
    '/admin/roles': 'Admin Roles',
    '/admin/authority': 'Control Authority',
    '/admin/profile': 'Profile',
    '/admin/settings': 'Settings',
  };

  if (/^\/admin\/products\/\d+\/edit$/.test(pathname)) return 'Edit Product';
  return titleMap[pathname] ?? 'Admin';
}
