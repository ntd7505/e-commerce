import React, { useState, useEffect } from 'react';
import { Mail, Lock, KeyRound, ArrowRight, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { resetPassword, forgotPassword } from '../../features/auth/authApi';
import { useToast } from '../../features/ui/ToastProvider';
import { validatePassword } from '../../features/auth/passwordValidation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const validation = validatePassword(newPassword);
  const isConfirmMatch = confirmPassword === newPassword && confirmPassword !== '';

  useEffect(() => {
    const savedEmail = sessionStorage.getItem('nexamart_password_reset_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    const savedTimestamp = sessionStorage.getItem('nexamart_password_reset_timestamp');
    if (savedTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      if (elapsed < 60) {
        setCooldown(60 - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    
    try {
      await forgotPassword({ email });
      sessionStorage.setItem('nexamart_password_reset_timestamp', Date.now().toString());
      setCooldown(60);
      showToast('Đã gửi lại mã xác nhận', 'success');
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại sau', 'error');
    }
  };

  const parseError = (err: any) => {
    const errorCode = err?.response?.data?.code || err?.message;
    switch (errorCode) {
      case 'PASSWORD_RESET_CODE_INVALID':
        return 'Mã xác nhận không hợp lệ.';
      case 'PASSWORD_RESET_CODE_EXPIRED':
        return 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.';
      case 'PASSWORD_RESET_CODE_ATTEMPTS_EXCEEDED':
        return 'Bạn đã nhập sai quá số lần cho phép. Vui lòng yêu cầu mã mới.';
      case 'PASSWORD_SAME_AS_CURRENT':
        return 'Mật khẩu mới không được trùng với mật khẩu hiện tại.';
      default:
        return 'Có lỗi xảy ra, vui lòng thử lại.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid || !isConfirmMatch || code.length !== 6) return;

    setError('');
    setIsLoading(true);

    try {
      await resetPassword({
        email,
        code,
        newPassword,
        confirmPassword
      });
      
      sessionStorage.removeItem('nexamart_password_reset_email');
      sessionStorage.removeItem('nexamart_password_reset_timestamp');
      showToast('Đổi mật khẩu thành công', 'success');
      navigate('/login?passwordChanged=1');
    } catch (err: any) {
      setError(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-sm border border-border text-center">
          <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h1 className="text-xl font-bold text-text mb-2">Không tìm thấy yêu cầu</h1>
          <p className="text-muted mb-6">
            Bạn cần yêu cầu cấp lại mật khẩu trước khi truy cập trang này.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-hover transition-colors w-full"
          >
            Đến trang Quên mật khẩu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-sm border border-border">
        <h1 className="text-wrap-balance text-3xl font-bold text-text mb-2">Đặt lại mật khẩu</h1>
        <p className="text-muted mb-8">
          Nhập mã xác nhận (6 số) đã được gửi đến email của bạn và đặt mật khẩu mới.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-canvas text-muted outline-none"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-text">Mã xác nhận</label>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="text-sm font-medium text-primary hover:text-primary-hover disabled:text-muted disabled:cursor-not-allowed transition-colors"
              >
                {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã'}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Nhập 6 số"
                maxLength={6}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Mật khẩu mới</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

          {error && (
            <div className="p-3 bg-danger-soft text-danger text-sm rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !validation.isValid || !isConfirmMatch || code.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
