import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../features/auth/authApi';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await signIn({ email, password });

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/admin/dashboard');
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex items-center justify-center p-4">

      <div className="max-w-[420px] w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B2113] mb-2">Welcome Back</h1>
          <p className="text-[13px] text-gray-500 font-medium">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block text-[13px] font-bold text-[#0B2113] mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dealport.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[13px] font-bold text-[#0B2113]">Password</label>
              <a href="#" className="text-[12px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-gray-200 rounded-lg text-[13px] font-medium text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1 mb-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded text-emerald-500 border-gray-300 accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="remember" className="text-[13px] text-gray-500 font-medium cursor-pointer select-none">
              Remember for 30 days
            </label>
          </div>

          {error && (
            <p className="text-[13px] font-medium text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#3c9c64] text-white px-5 py-3.5 rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>

        </form>
      </div>
    </div>
  );
}
