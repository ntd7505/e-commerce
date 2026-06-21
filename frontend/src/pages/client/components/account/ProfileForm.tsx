import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../features/auth/AuthProvider';
import { updateMe } from '../../../../features/auth/authApi';
import { parseApiError } from '../../../../utils/apiError';
import AvatarPreview from './AvatarPreview';
import { Loader2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

export default function ProfileForm() {
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    avatarUrl: ''
  });
  
  const [initialData, setInitialData] = useState({
    fullName: '',
    phoneNumber: '',
    avatarUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [globalError, setGlobalError] = useState('');
  
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const data = {
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        avatarUrl: user.avatarUrl || ''
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(data);
      setInitialData(data);
    }
  }, [user]);

  const isDirty = 
    formData.fullName !== initialData.fullName ||
    formData.phoneNumber !== initialData.phoneNumber ||
    formData.avatarUrl !== initialData.avatarUrl;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
    setGlobalError('');
    setSuccessMsg('');
  };

  const handleAvatarChange = (url: string) => {
    setFormData(prev => ({ ...prev, avatarUrl: url }));
    if (errors.avatarUrl) {
      setErrors(prev => ({ ...prev, avatarUrl: '' }));
    }
    setGlobalError('');
    setSuccessMsg('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let firstErrorField: 'fullName' | 'phoneNumber' | null = null;
    
    const cleanFullName = formData.fullName.trim().replace(/\s+/g, ' ');
    if (!cleanFullName || cleanFullName.length < 5) {
      newErrors.fullName = 'Họ và tên bắt buộc và phải có ít nhất 5 ký tự.';
      firstErrorField = 'fullName';
    }

    const cleanPhone = formData.phoneNumber.trim();
    const phoneRegex = /^[0-9]{10}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      newErrors.phoneNumber = 'Số điện thoại bắt buộc phải bao gồm đúng 10 chữ số.';
      if (!firstErrorField) firstErrorField = 'phoneNumber';
    }

    if (formData.avatarUrl.trim()) {
      try {
        new URL(formData.avatarUrl.trim());
      } catch {
        newErrors.avatarUrl = 'URL ảnh không hợp lệ. Vui lòng nhập link bắt đầu bằng http:// hoặc https://';
      }
    }

    setErrors(newErrors);
    
    if (firstErrorField === 'fullName') {
      fullNameRef.current?.focus();
    } else if (firstErrorField === 'phoneNumber') {
      phoneRef.current?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !isDirty || isSaving) return;
    
    setIsSaving(true);
    setGlobalError('');
    setSuccessMsg('');
    
    try {
      const payload = {
        fullName: formData.fullName.trim().replace(/\s+/g, ' '),
        phoneNumber: formData.phoneNumber.trim(),
        avatarUrl: formData.avatarUrl.trim() || undefined
      };
      
      const updatedUser = await updateMe(payload);
      setUser(updatedUser);
      setSuccessMsg('Cập nhật thông tin thành công!');
      setInitialData({
        fullName: updatedUser.fullName || '',
        phoneNumber: updatedUser.phoneNumber || '',
        avatarUrl: updatedUser.avatarUrl || ''
      });
    } catch (err: unknown) {
      const parsedError = parseApiError(err);
      
      if (parsedError.details) {
        const fieldErrors: Record<string, string> = {};
        let focused = false;
        
        if (parsedError.message === 'PHONE_EXISTED' || parsedError.details.phoneNumber === 'PHONE_EXISTED') {
           fieldErrors.phoneNumber = 'Số điện thoại này đã được sử dụng bởi người dùng khác.';
           phoneRef.current?.focus();
           focused = true;
        } else if (parsedError.details.phoneNumber) {
           fieldErrors.phoneNumber = parsedError.details.phoneNumber;
           if (!focused) { phoneRef.current?.focus(); focused = true; }
        }
        
        if (parsedError.details.fullName) {
           fieldErrors.fullName = parsedError.details.fullName;
           if (!focused) { fullNameRef.current?.focus(); focused = true; }
        }

        if (Object.keys(fieldErrors).length > 0) {
           setErrors(fieldErrors);
        } else {
           setGlobalError(parsedError.message);
        }
      } else {
        if (parsedError.message === 'PHONE_EXISTED') {
           setErrors({ phoneNumber: 'Số điện thoại này đã được sử dụng bởi người dùng khác.' });
           phoneRef.current?.focus();
        } else {
           setGlobalError(parsedError.message || 'Có lỗi xảy ra khi cập nhật thông tin.');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    setFormData(initialData);
    setErrors({});
    setGlobalError('');
    setSuccessMsg('');
  };

  if (!user) {
    return (
      <div className="animate-pulse flex flex-col gap-6 w-full">
        <div className="h-8 bg-gray-100 rounded-lg w-1/4 mb-4"></div>
        <div className="h-14 bg-gray-50 rounded-xl border border-gray-100"></div>
        <div className="h-14 bg-gray-50 rounded-xl border border-gray-100"></div>
        <div className="h-14 bg-gray-50 rounded-xl border border-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-8 lg:items-start w-full">
      <div className="flex-1 w-full lg:max-w-2xl">
        {successMsg && (
          <div role="status" className="mb-8 p-4 bg-green-50 text-green-800 rounded-xl border border-green-200 text-sm flex items-start gap-3 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> 
            <div className="flex-1">
              <p className="font-semibold text-green-900 mb-0.5">Thành công</p>
              <p>{successMsg}</p>
            </div>
            <button type="button" onClick={() => setSuccessMsg('')} className="text-green-600 hover:text-green-900 focus-visible:outline-green-600 rounded p-1 transition-colors">
              <span className="sr-only">Đóng</span>
              &times;
            </button>
          </div>
        )}
        
        {globalError && (
          <div role="alert" className="mb-8 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" /> 
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-0.5">Đã có lỗi xảy ra</p>
              <p>{globalError}</p>
            </div>
            <button type="button" onClick={() => setGlobalError('')} className="text-red-600 hover:text-red-900 focus-visible:outline-red-600 rounded p-1 transition-colors">
               <span className="sr-only">Đóng</span>
              &times;
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Email đăng nhập</label>
            <input 
              type="email" 
              value={user.email} 
              disabled 
              aria-describedby="email-help"
              className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed shadow-sm focus:outline-none"
            />
            <p id="email-help" className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
               <AlertCircle className="w-3.5 h-3.5" />
               Email đăng nhập không thể thay đổi.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800">Họ và Tên <span className="text-red-500">*</span></label>
            <input 
              id="fullName"
              type="text" 
              name="fullName"
              ref={fullNameRef}
              value={formData.fullName}
              onChange={handleChange}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all shadow-sm focus:ring-2
                ${errors.fullName 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/20' 
                  : 'border-gray-300 focus:border-nexa-blue focus:ring-blue-100 bg-white'}`}
              placeholder="Nhập họ và tên (tối thiểu 5 ký tự)"
              required
            />
            {errors.fullName && <p id="fullName-error" className="text-sm text-red-500 mt-1 font-medium">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-800">Số điện thoại <span className="text-red-500">*</span></label>
            <input 
              id="phoneNumber"
              type="tel" 
              inputMode="numeric"
              maxLength={10}
              name="phoneNumber"
              ref={phoneRef}
              value={formData.phoneNumber}
              onChange={handleChange}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all shadow-sm focus:ring-2
                ${errors.phoneNumber 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/20' 
                  : 'border-gray-300 focus:border-nexa-blue focus:ring-blue-100 bg-white'}`}
              placeholder="Nhập 10 chữ số"
              required
            />
            {errors.phoneNumber && <p id="phoneNumber-error" className="text-sm text-red-500 mt-1 font-medium">{errors.phoneNumber}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="avatarUrl" className="block text-sm font-semibold text-gray-800">URL Ảnh đại diện</label>
            <input 
              id="avatarUrl"
              type="url" 
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              aria-invalid={!!errors.avatarUrl}
              aria-describedby={errors.avatarUrl ? "avatarUrl-error" : undefined}
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all shadow-sm focus:ring-2
                ${errors.avatarUrl 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/20' 
                  : 'border-gray-300 focus:border-nexa-blue focus:ring-blue-100 bg-white'}`}
              placeholder="https://example.com/avatar.jpg"
            />
            {errors.avatarUrl && <p id="avatarUrl-error" className="text-sm text-red-500 mt-1 font-medium">{errors.avatarUrl}</p>}
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-4">
            <button 
              type="submit" 
              disabled={isSaving || !isDirty}
              className="bg-nexa-blue text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 hover:shadow-blue-500/30 min-w-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-nexa-blue"
            >
              {isSaving ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...</>
              ) : 'Lưu thay đổi'}
            </button>
            
            {isDirty && !isSaving && (
              <button
                type="button"
                onClick={handleUndo}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                aria-label="Hoàn tác thay đổi"
              >
                <RefreshCcw className="w-4 h-4" />
                Hoàn tác
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="hidden lg:block w-px bg-gray-100 self-stretch mx-6"></div>
      
      <AvatarPreview avatarUrl={formData.avatarUrl} onChange={handleAvatarChange} />
    </div>
  );
}
