import { useEffect, useState } from 'react';
import { Container, Section, Button, Badge } from '../../../../components/common';
import { 
  Share2, Copy, EyeOff, Edit3, HelpCircle
} from 'lucide-react';
import { getCurrentAdminUser } from '../../customers/adminUserApi';
import type { AdminUserResponse } from '../../customers/adminUserTypes';
import { LoadingState, ErrorState } from '../../../../components/common/States';

export default function AdminProfilePageContent() {
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentAdminUser();
        setUser(data);
        setError('');
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Không thể tải thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) return <LoadingState />;
  if (error || !user) return <ErrorState message={error || "Không tìm thấy thông tin tài khoản."} />;

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName) + "&background=random";

  // Split fullName safely
  const nameParts = user.fullName.split(' ');
  const firstName = nameParts.length > 0 ? nameParts[0] : '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  return (
    <Container size="default">
      <Section spacing="md" className="space-y-8">
        <h2 className="text-2xl font-bold text-text mb-6">Hồ sơ cá nhân</h2>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
         
         {/* Left Column */}
         <div className="w-full lg:w-[35%] flex flex-col gap-6">
            
            {/* Profile Card */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6">
                <h3 className="font-bold text-text text-base">Thông tin</h3>
                <div className="flex items-center gap-3 text-muted">
                  <button className="hover:text-primary transition-colors" title="Chỉnh sửa"><Edit3 className="w-4 h-4" /></button>
                  <button className="hover:text-primary transition-colors" title="Chia sẻ"><Share2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-[3px] border-white shadow-sm ring-1 ring-border">
                 <img src={user.avatarUrl || defaultAvatar} alt={user.fullName} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-text mb-1">{user.fullName}</h3>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-muted text-sm font-medium">{user.email}</span>
                <button className="text-primary hover:text-primary-hover transition-colors" title="Sao chép email"><Copy className="w-3.5 h-3.5" /></button>
              </div>
              
              <div className="w-full border-t border-border mb-6"></div>
              
              <p className="text-muted text-sm font-medium mb-4">Vai trò</p>
              
              <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                 {user.roles.map(role => (
                   <Badge key={role.name} variant="primary" size="sm">
                     {role.name}
                   </Badge>
                 ))}
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-text text-base">Đổi mật khẩu</h3>
                <a href="#" className="flex items-center gap-1.5 text-sm text-primary font-bold hover:underline">
                  Cần giúp đỡ <HelpCircle className="w-3.5 h-3.5" />
                </a>
              </div>
              
              <div className="flex flex-col gap-5">
                 <div>
                    <label className="block text-sm font-bold text-text mb-2">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <input type="password" placeholder="Nhập mật khẩu hiện tại" className="w-full px-4 py-2.5 bg-surface-alt border border-border-strong rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-text mb-2">Mật khẩu mới</label>
                    <div className="relative">
                      <input type="password" placeholder="Nhập mật khẩu mới" className="w-full px-4 py-2.5 bg-surface-alt border border-border-strong rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
                 
                 <Button variant="primary" fullWidth className="mt-1">
                   Lưu thay đổi
                 </Button>
              </div>
            </div>

         </div>

         {/* Right Column */}
         <div className="w-full lg:w-[65%] bg-surface p-8 rounded-xl border border-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-text text-lg">Cập nhật hồ sơ</h3>
              <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                Chỉnh sửa
              </Button>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full overflow-hidden border-[2px] border-white ring-1 ring-border shadow-sm flex-shrink-0">
                 <img src={user.avatarUrl || defaultAvatar} alt={user.fullName} className="w-full h-full object-cover" />
              </div>
              <Button variant="primary" size="sm">Tải ảnh mới</Button>
              <Button variant="outline" size="sm">Xóa ảnh</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mb-6">
               <div>
                  <label className="block text-sm font-bold text-text mb-2">Họ và đệm</label>
                  <input type="text" defaultValue={lastName} className="w-full px-4 py-3 bg-surface-alt border border-border-strong rounded-lg text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-text mb-2">Tên</label>
                  <input type="text" defaultValue={firstName} className="w-full px-4 py-3 bg-surface-alt border border-border-strong rounded-lg text-sm font-semibold text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-text mb-2">Số điện thoại</label>
                  <div className="flex bg-surface-alt border border-border-strong rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <input type="text" defaultValue={user.phoneNumber || ""} placeholder="Chưa cập nhật" className="flex-1 px-4 py-3 bg-transparent text-sm font-semibold text-text focus:outline-none placeholder:text-muted" />
                    <button className="px-3 border-l border-border flex items-center justify-center gap-1.5 hover:bg-surface transition-colors">
                      <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-5 h-auto rounded-[2px]" />
                    </button>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-text mb-2">Email</label>
                  <input type="email" defaultValue={user.email} className="w-full px-4 py-3 bg-surface-alt border border-border-strong rounded-lg text-sm font-semibold text-text focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:text-muted" disabled />
               </div>
               <div>
                  <label className="block text-sm font-bold text-text mb-2">Trạng thái</label>
                  <input type="text" defaultValue={user.status === "ACTIVE" ? "Hoạt động" : "Bị khóa"} className="w-full px-4 py-3 bg-surface-alt border border-border-strong rounded-lg text-sm font-semibold text-text focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:text-muted" disabled />
               </div>
            </div>

         </div>
        </div>
      </Section>
    </Container>
  );
}
