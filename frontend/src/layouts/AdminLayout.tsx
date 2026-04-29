import React from 'react';
import {
  LayoutDashboard, ShoppingCart, Users, Ticket, LayoutGrid, CreditCard, Award,
  PlusSquare, Image as ImageIcon, ClipboardList, MessageSquare,
  UserCog, ShieldCheck, Search, Bell, Sun, LogOut, ExternalLink, Menu
} from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom';

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to }) => {
  return (
    <NavLink
      end
      to={to}
      className={({ isActive }) => `flex items-center px-4 py-2 text-[13px] font-medium rounded-lg mb-1 transition-colors ${
        isActive
          ? 'bg-emerald-500 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4 mr-3" /> {label}
    </NavLink>
  );
};

export default function AdminLayout() {
  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full overflow-hidden">
        <div className="p-5 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-8 pl-1">
            <span className="font-extrabold text-xl text-emerald-600 tracking-tight flex items-center gap-1">
              DEALPORT
            </span>
            <button className="p-1 hover:bg-gray-100 rounded-md text-gray-500 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <nav className="mb-6">
            <h3 className="px-4 text-[11px] font-semibold text-gray-400 mb-2">Main menu</h3>
            <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/admin/orders" icon={ShoppingCart} label="Order Management" />
            <SidebarItem to="/admin/customers" icon={Users} label="Customers" />
            <SidebarItem to="/admin/coupons" icon={Ticket} label="Coupon Code" />
            <SidebarItem to="/admin/categories" icon={LayoutGrid} label="Categories" />
            <SidebarItem to="/admin/transactions" icon={CreditCard} label="Transaction" />
            <SidebarItem to="/admin/brands" icon={Award} label="Brand" />
          </nav>

          <nav className="mb-6">
            <h3 className="px-4 text-[11px] font-semibold text-gray-400 mb-2">Product</h3>
            <SidebarItem to="/admin/products/add" icon={PlusSquare} label="Add Products" />
            <SidebarItem to="/admin/products/media" icon={ImageIcon} label="Product Media" />
            <SidebarItem to="/admin/products" icon={ClipboardList} label="Product List" />
            <SidebarItem to="/admin/products/reviews" icon={MessageSquare} label="Product Reviews" />
          </nav>

          <nav className="mb-6">
            <h3 className="px-4 text-[11px] font-semibold text-gray-400 mb-2">Admin</h3>
            <SidebarItem to="/admin/roles" icon={UserCog} label="Admin role" />
            <SidebarItem to="/admin/authority" icon={ShieldCheck} label="Control Authority" />
          </nav>
        </div>
        
        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-3 px-2 py-2 mb-3">
            <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-9 h-9 rounded-full bg-gray-200 border border-gray-200" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-900 truncate">Dealport</p>
              <p className="text-[11px] text-gray-500 truncate">Mark@thedesigner...</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <button className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="flex items-center gap-2"><ImageIcon className="w-4 h-4 text-emerald-600" /> Your Shop</span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          
          <div className="flex items-center gap-5">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-100 rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow placeholder:text-gray-400" 
                placeholder="Search data, users, or reports" 
                type="text" 
              />
            </div>
            
            <div className="flex items-center gap-5">
              <button className="relative text-gray-500 hover:text-emerald-500 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner">
                 <button className="p-1 rounded-full bg-white shadow-sm"><Sun className="w-4 h-4 text-gray-700" /></button>
                 <button className="p-1 rounded-full"><Sun className="w-4 h-4 text-transparent" /></button> 
              </div>

              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-9 h-9 rounded-full border-2 border-white shadow-sm cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8 hide-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
