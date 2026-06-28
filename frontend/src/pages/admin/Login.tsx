import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../features/auth/authApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await signIn({ email, password });

      const { setAuthSession } = await import('../../features/auth/authStorage');
      setAuthSession(data.accessToken, data.refreshToken);

      const { getMe } = await import('../../features/auth/authApi');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userData = await getMe();

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/admin/dashboard';
      window.location.href = redirect;

    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-surface rounded-2xl border border-border p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-wrap-balance text-2xl font-bold text-text mb-1">Dealport</h1>
          <p className="text-sm font-semibold text-success tracking-wider uppercase">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-text mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dealport.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-strong bg-surface text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-success focus:ring-1 focus:ring-success/20"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-text">
                Mật khẩu
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-strong bg-surface text-sm text-text placeholder:text-muted outline-none transition-colors focus:border-success focus:ring-1 focus:ring-success/20"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-border-strong text-success focus:ring-success/20"
            />
            <label htmlFor="remember" className="text-sm text-muted cursor-pointer select-none">
              Ghi nhớ đăng nhập
            </label>
          </div>

          {error && (
            <div className="p-3 bg-danger-soft border border-danger-soft rounded-lg">
              <p className="text-sm font-semibold text-danger text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-success text-white py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:brightness-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
