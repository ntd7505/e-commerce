import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { signIn, getMe } from '../../features/auth/authApi';
import { setAuthSession } from '../../features/auth/authStorage';
import { useAuth } from '../../features/auth/AuthProvider';
import { useToast } from '../../features/ui/ToastProvider';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (searchParams.get('passwordChanged') === '1') {
      showToast('Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.', 'success');
      // Clean up URL
      searchParams.delete('passwordChanged');
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  }, [searchParams, navigate, showToast]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await signIn({ email, password });
      setAuthSession(data.accessToken, data.refreshToken);
      const userData = await getMe();
      setUser(userData);

      const redirect = searchParams.get('redirect');
      if (redirect && redirect.startsWith('/')) {
        navigate(redirect, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-sm border border-border">
        <h1 className="text-wrap-balance text-3xl font-bold text-text mb-2">Đăng nhập</h1>
        <p className="text-muted mb-8">Chào mừng bạn quay lại NexaMart</p>

        <form onSubmit={handleLogin} className="space-y-5">
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-text">Mật khẩu</label>
              <Link to="/forgot-password" className="text-sm text-primary font-medium hover:text-primary-hover transition-colors">Quên mật khẩu?</Link>
            </div>
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
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary font-medium hover:text-primary">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
