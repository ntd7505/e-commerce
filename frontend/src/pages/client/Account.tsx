import React from 'react';
import { Link } from 'react-router-dom';
import AccountSidebar from './components/account/AccountSidebar';
import ProfileForm from './components/account/ProfileForm';
import { Lock } from 'lucide-react';

export default function Account() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-nexa-blue transition-colors font-medium">Trang chủ</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Thông tin tài khoản</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <AccountSidebar />

          {/* Main Content */}
          <div className="flex-1 w-full flex flex-col gap-8">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
               <div className="mb-8 pb-5 border-b border-gray-100">
                 <h1 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h1>
                 <p className="text-gray-500 mt-2">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
               </div>
               
               <ProfileForm />
             </div>
             
             {/* Security Block */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
                <div className="mb-6 pb-5 border-b border-gray-100">
                   <h2 className="text-xl font-bold text-gray-900">Bảo mật</h2>
                </div>
                
                <div className="bg-gray-50/50 rounded-xl p-5 flex flex-wrap items-center justify-between gap-5 border border-gray-100 shadow-sm transition-all hover:border-gray-200">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 shrink-0">
                       <Lock className="w-6 h-6 text-nexa-blue" />
                     </div>
                     <div>
                       <div className="text-base font-bold text-gray-900 mb-0.5">Đổi mật khẩu</div>
                       <div className="text-sm text-gray-500">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh</div>
                     </div>
                   </div>
                   <div className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 cursor-not-allowed border border-gray-200">
                     Tính năng đổi mật khẩu chưa được hỗ trợ
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
