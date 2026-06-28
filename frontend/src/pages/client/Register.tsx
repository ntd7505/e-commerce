import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../features/auth/authApi';

export default function ClientRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerUser({ email, password, fullName, phoneNumber });
      navigate('/login?registered=true');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-sm border border-border">
        <h1 className="text-wrap-balance text-3xl font-bold text-text mb-2">Đăng ký</h1>
        <p className="text-muted mb-8">Tạo tài khoản mới để mua sắm</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Họ và tên</label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Email</label>
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

          <div>
            <label className="block text-sm font-medium text-text mb-1">Số điện thoại</label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-strong focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-danger-soft text-danger text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary font-medium hover:text-primary">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
