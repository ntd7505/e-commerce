import React from 'react';
import ProfileForm from './components/account/ProfileForm';
import { Lock } from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';

export default function Account() {
  return (
    <AccountPageLayout
      breadcrumbCurrent="Thông tin tài khoản"
      title="Hồ sơ của tôi"
      description="Quản lý thông tin hồ sơ để bảo mật tài khoản"
      contentClassName="flex flex-col gap-10"
    >
      {/* Profile Form */}
      <div>
        <ProfileForm />
      </div>
      
      {/* Security Block */}
      <div>
        <div className="mb-6 pb-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Bảo mật</h2>
        </div>
        
        <div className="bg-gray-50/50 rounded-xl p-5 flex flex-wrap items-center justify-between gap-5 border border-gray-100 shadow-sm transition-all hover:border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-600 shrink-0">
              <Lock className="w-6 h-6 text-blue-600" />
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
    </AccountPageLayout>
  );
}
