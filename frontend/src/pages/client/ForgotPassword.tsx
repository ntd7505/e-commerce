import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../features/auth/authApi';
import { useToast } from '../../features/ui/ToastProvider';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      
      // The API always returns success (2005) regardless of whether email exists or not
      sessionStorage.setItem('nexamart_password_reset_email', email.trim());
      sessionStorage.setItem('nexamart_password_reset_timestamp', Date.now().toString());
      showToast('Nếu email tồn tại, mã xác nhận đã được gửi đến hộp thư của bạn.', 'success');
      
      // Navigate to reset password page where they can enter the OTP
      navigate('/reset-password');
    } catch {
      showToast('Có lỗi xảy ra, vui lòng thử lại sau', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-sm border border-border">
        <h1 className="text-wrap-balance text-3xl font-bold text-text mb-2">Quên mật khẩu</h1>
        <p className="text-muted mb-8">
          Vui lòng nhập email bạn đã đăng ký. Chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email đăng ký</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang gửi yêu cầu...' : 'Gửi mã xác nhận'}
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
