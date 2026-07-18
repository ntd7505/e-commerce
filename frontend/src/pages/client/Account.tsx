import React, { useState } from 'react';
import ProfileForm from './components/account/ProfileForm';
import { Lock } from 'lucide-react';
import AccountPageLayout from './components/account/AccountPageLayout';
import ChangePasswordModal from './components/account/ChangePasswordModal';

export default function Account() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
        <div className="mb-6 pb-5 border-b border-border">
          <h2 className="text-xl font-bold text-text">Bảo mật</h2>
        </div>
        
        <div className="bg-surface/50 rounded-xl p-5 flex flex-wrap items-center justify-between gap-5 border border-border shadow-sm transition-all hover:border-border-strong">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border text-muted shrink-0">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-base font-bold text-text mb-0.5">Đổi mật khẩu</div>
              <div className="text-sm text-muted">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover border border-primary-hover shadow-sm transition-all"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </AccountPageLayout>
  );
}
