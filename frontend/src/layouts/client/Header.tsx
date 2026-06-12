import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 py-4" data-purpose="primary-header">
      <div className="container-custom flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-nexa-blue shrink-0">
          NexaMart
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-2xl relative">
          <div className="flex items-center border-2 border-gray-200 rounded-md bg-white overflow-hidden">
            <input
              className="w-full px-4 py-2 outline-none border-none focus:ring-0 text-sm"
              placeholder="Tìm sản phẩm, thương hiệu hoặc danh mục"
              type="text"
            />
            <button className="px-5 py-2 text-gray-400 cursor-pointer">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-400 flex gap-4">
            <span className="cursor-pointer hover:text-nexa-blue">Điện thoại Samsung</span>
            <span className="cursor-pointer hover:text-nexa-blue">Tai nghe bluetooth</span>
            <span className="cursor-pointer hover:text-nexa-blue">Laptop Dell...</span>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6 ml-10">
          <div className="relative group cursor-pointer flex items-center gap-2 hover:text-nexa-blue transition-colors">
            <i className="fa-solid fa-bars text-xl"></i>
            <span className="font-medium">Danh mục</span>
            
            {/* Dropdown Menu (Hidden by default, shown on hover) */}
            <div className="absolute top-full left-0 mt-4 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 z-50 border border-gray-100">
              <ul className="py-2 text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-50 hover:text-nexa-blue transition-colors border-b border-gray-50 flex items-center justify-between">
                  <span><i className="fa-solid fa-mobile-screen mr-2 w-5"></i>Điện thoại</span>
                  <i className="fa-solid fa-chevron-right text-xs text-gray-400"></i>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 hover:text-nexa-blue transition-colors border-b border-gray-50 flex items-center justify-between">
                  <span><i className="fa-solid fa-laptop mr-2 w-5"></i>Laptop</span>
                  <i className="fa-solid fa-chevron-right text-xs text-gray-400"></i>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 hover:text-nexa-blue transition-colors border-b border-gray-50 flex items-center justify-between">
                  <span><i className="fa-solid fa-headphones mr-2 w-5"></i>Âm thanh</span>
                  <i className="fa-solid fa-chevron-right text-xs text-gray-400"></i>
                </li>
                <li className="px-4 py-2 hover:bg-gray-50 hover:text-nexa-blue transition-colors flex items-center justify-between">
                  <span><i className="fa-solid fa-stopwatch mr-2 w-5"></i>Đồng hồ</span>
                  <i className="fa-solid fa-chevron-right text-xs text-gray-400"></i>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer hover:text-nexa-blue transition-colors">
            <i className="fa-regular fa-user text-xl"></i>
            <span className="text-sm font-medium">Tài khoản</span>
          </div>
          <div className="relative cursor-pointer hover:text-nexa-blue transition-colors">
            <i className="fa-solid fa-cart-shopping text-2xl text-gray-700 group-hover:text-nexa-blue"></i>
            <span className="absolute -top-2 -right-2 bg-nexa-red text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
