import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../../../features/auth/authApi';
import { useAuth } from '../../../../features/auth/AuthProvider';
import { useToast } from '../../../../features/ui/ToastProvider';
import { validatePassword } from '../../../../features/auth/passwordValidation';
import { clearAuthSession } from '../../../../features/auth/authStorage';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validation = validatePassword(newPassword);
  const isConfirmMatch = confirmPassword === newPassword && confirmPassword !== '';

  if (!isOpen) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseError = (err: any) => {
    const errorCode = err?.response?.data?.code || err?.message;
    switch (errorCode) {
      case 'CURRENT_PASSWORD_INCORRECT':
        return 'Mật khẩu hiện tại không đúng.';
      case 'PASSWORD_SAME_AS_CURRENT':
        return 'Mật khẩu mới không được trùng với mật khẩu hiện tại.';
      default:
        return 'Có lỗi xảy ra, vui lòng thử lại.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid || !isConfirmMatch || !currentPassword) return;

    setError('');
    setIsLoading(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      
      showToast('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.', 'success');
      
      // Clear local auth session directly without calling backend logout
      clearAuthSession();
      setUser(null);
      
      onClose();
      navigate('/login?passwordChanged=1');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-surface w-full max-w-md rounded-2xl shadow-lg border border-border pointer-events-auto flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <h2 className="text-xl font-bold text-text">Đổi mật khẩu</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-muted hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {error === 'Mật khẩu hiện tại không đúng.' && (
                  <p className="mt-1 text-xs text-danger">{error}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {newPassword && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className={validation.length ? 'text-success' : 'text-muted'}>✓ Tối thiểu 8 ký tự</p>
                    <p className={validation.uppercase ? 'text-success' : 'text-muted'}>✓ Có ít nhất 1 chữ hoa</p>
                    <p className={validation.lowercase ? 'text-success' : 'text-muted'}>✓ Có ít nhất 1 chữ thường</p>
                    <p className={validation.digit ? 'text-success' : 'text-muted'}>✓ Có ít nhất 1 chữ số</p>
                    <p className={validation.special ? 'text-success' : 'text-muted'}>✓ Có ký tự đặc biệt (!@#$%^&*)</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full pl-10 pr-10 py-3 rounded-lg border ${confirmPassword && !isConfirmMatch ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border-strong focus:ring-primary focus:border-primary'} outline-none transition-colors`}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && !isConfirmMatch && (
                  <p className="mt-1 text-xs text-danger">Mật khẩu xác nhận không khớp</p>
                )}
              </div>

              {error && error !== 'Mật khẩu hiện tại không đúng.' && (
                <div className="p-3 bg-danger-soft text-danger text-sm rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !validation.isValid || !isConfirmMatch || !currentPassword}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
