import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';
import { updateMe } from '../../features/auth/authApi';
import { Camera, User as UserIcon, LogOut, Package, MapPin, Star, Ticket, Lock } from 'lucide-react';

export default function Account() {
  const { user, setUser, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    avatarUrl: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    if (!formData.fullName || formData.fullName.trim().length < 5) {
      setErrorMsg('Họ & tên phải có ít nhất 5 ký tự.');
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber.trim())) {
      setErrorMsg('Số điện thoại phải bao gồm đúng 10 chữ số.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        avatarUrl: formData.avatarUrl.trim() || undefined
      };
      
      const updatedUser = await updateMe(payload);
      setUser(updatedUser);
      setSuccessMsg('Cập nhật thông tin thành công!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null; // handled by RequireAuth

  const displayAvatar = formData.avatarUrl.trim() || user.avatarUrl;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-nexa-blue">Trang chủ</Link>
          <span className="mx-2">{'>'}</span>
          <span className="text-gray-900 font-medium">Thông tin tài khoản</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar */}
          <div className="w-full lg:w-64 shrink-0 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs text-gray-500">Tài khoản của</div>
                <div className="font-bold text-gray-900 truncate">{user.fullName}</div>
              </div>
            </div>
            
            <ul className="py-2">
              <li>
                <div className="flex items-center gap-3 px-5 py-3 bg-blue-50/50 text-nexa-blue font-medium border-l-4 border-nexa-blue cursor-default">
                  <UserIcon className="w-5 h-5" />
                  Thông tin tài khoản
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 px-5 py-3 text-gray-400 cursor-not-allowed border-l-4 border-transparent">
                  <Package className="w-5 h-5" />
                  Quản lý đơn hàng <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-auto">Sắp ra mắt</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 px-5 py-3 text-gray-400 cursor-not-allowed border-l-4 border-transparent">
                  <MapPin className="w-5 h-5" />
                  Sổ địa chỉ <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-auto">Sắp ra mắt</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 px-5 py-3 text-gray-400 cursor-not-allowed border-l-4 border-transparent">
                  <Star className="w-5 h-5" />
                  Đánh giá sản phẩm <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-auto">Sắp ra mắt</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 px-5 py-3 text-gray-400 cursor-not-allowed border-l-4 border-transparent">
                  <Ticket className="w-5 h-5" />
                  Mã giảm giá <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-auto">Sắp ra mắt</span>
                </div>
              </li>
              <li className="border-t border-gray-50 mt-2 pt-2">
                <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3 text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors border-l-4 border-transparent text-left cursor-pointer">
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">Hồ sơ của tôi</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Col */}
              <div className="lg:col-span-2">
                {successMsg && (
                  <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-circle-check"></i> {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="col-span-1 text-sm text-gray-600 text-right">Email</label>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        value={user.email} 
                        disabled 
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="col-span-1 text-sm text-gray-600 text-right">Họ & Tên</label>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 focus:border-nexa-blue focus:ring-1 focus:ring-nexa-blue rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4">
                    <label className="col-span-1 text-sm text-gray-600 text-right">Số điện thoại</label>
                    <div className="col-span-2">
                      <input 
                        type="text" 
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 focus:border-nexa-blue focus:ring-1 focus:ring-nexa-blue rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                        placeholder="Nhập số điện thoại (10 số)"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 items-start gap-4">
                    <label className="col-span-1 text-sm text-gray-600 text-right mt-3">Ảnh đại diện (URL)</label>
                    <div className="col-span-2">
                      <input 
                        type="url" 
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        className="w-full border border-gray-300 focus:border-nexa-blue focus:ring-1 focus:ring-nexa-blue rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">Để trống nếu muốn dùng ảnh mặc định. Chức năng upload ảnh đang được xây dựng.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-4 pt-4">
                    <div className="col-span-1"></div>
                    <div className="col-span-2">
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="bg-nexa-blue text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSaving ? (
                          <><i className="fa-solid fa-spinner fa-spin"></i> Đang lưu...</>
                        ) : 'Lưu thay đổi'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Avatar Preview Col */}
              <div className="lg:col-span-1 flex flex-col items-center justify-start border-l border-gray-100 pl-0 lg:pl-8 pt-8 lg:pt-0 mt-8 lg:mt-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 mb-4 border-2 border-gray-200 flex items-center justify-center shrink-0">
                  {displayAvatar ? (
                    <img 
                      src={displayAvatar} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).onerror = null;
                      }}
                    />
                  ) : (
                    <Camera className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="text-sm text-gray-500 text-center px-4">
                  Dung lượng file tối đa 1 MB <br/> Định dạng: .JPEG, .PNG <br/>
                  <span className="italic text-xs">(Hiện tại chỉ hỗ trợ nhập URL ảnh)</span>
                </div>
              </div>
            </div>
            
            {/* Security Block */}
            <div className="mt-12 pt-8 border-t border-gray-100">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật</h3>
               <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-600">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Đổi mật khẩu</div>
                      <div className="text-xs text-gray-500">Bảo vệ tài khoản của bạn bằng mật khẩu mạnh</div>
                    </div>
                  </div>
                  <button disabled className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                    Chưa hỗ trợ
                  </button>
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
