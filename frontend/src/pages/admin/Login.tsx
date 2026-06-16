import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
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
      
      const { setAuthSession } = await import('../../features/auth/authStorage');
      setAuthSession(data.accessToken, data.refreshToken);
      
      const { getMe } = await import('../../features/auth/authApi');
      const userData = await getMe();
      
      // We need to reload to trigger AuthProvider loadUser, or set it directly.
      // Since AuthProvider checks token on mount, if we navigate and force a re-render it works.
      // Better yet, we can just reload the page to the redirect URL or dashboard.
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
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
          .font-editorial { font-family: 'Cormorant Garamond', serif; }
          .font-sans-modern { font-family: 'Outfit', sans-serif; }
          
          .surface-light {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(255,255,255,0.4);
          }
          
          .input-editorial {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(0, 0, 0, 0.08);
            color: #1a1a1a;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .input-editorial:focus {
            background: #ffffff;
            border-color: #059669;
            box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1);
          }

          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
        `}
      </style>
      
      <div className="min-h-screen w-full bg-[#F5F4F0] flex items-center justify-center p-4 relative overflow-hidden font-sans-modern text-[#1a1a1a]">
        
        {/* Soft Organic Orbs */}
        <div className="absolute top-[0%] left-[-5%] w-[45vw] h-[45vw] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-amber-100/60 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] bg-teal-100/50 rounded-full mix-blend-multiply filter blur-[90px] opacity-60 animate-pulse" style={{ animationDuration: '10s' }}></div>

        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

        <div className="max-w-[460px] w-full surface-light p-10 sm:p-12 rounded-[2rem] relative z-10">
          
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_rgba(5,150,105,0.25)] transform transition-transform hover:scale-105 duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-editorial font-bold text-[#1a1a1a] mb-3 tracking-tight">Dealport</h1>
            <p className="text-[13px] text-[#059669] font-medium tracking-[0.25em] uppercase">Admin Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="group">
              <label className="block text-[11px] font-bold text-gray-500 mb-2 tracking-widest uppercase">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dealport.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-[15px] input-editorial placeholder-gray-400 focus:outline-none"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#059669] transition-colors duration-400" />
              </div>
            </div>

            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold text-gray-500 tracking-widest uppercase">Password</label>
                <a href="#" className="text-[12px] font-semibold text-[#059669] hover:text-[#047857] transition-colors duration-300">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-[15px] input-editorial placeholder-gray-400 focus:outline-none"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#059669] transition-colors duration-400" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 mb-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="peer w-5 h-5 appearance-none border-2 border-gray-300 rounded bg-white checked:bg-[#059669] checked:border-[#059669] focus:outline-none transition-all duration-300 cursor-pointer"
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-1 top-1 transition-opacity duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label htmlFor="remember" className="text-[14px] text-gray-600 font-medium cursor-pointer select-none hover:text-[#1a1a1a] transition-colors duration-300">
                Keep me signed in
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-slide-down">
                <p className="text-[13px] font-semibold text-red-600 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden flex items-center justify-center gap-2 bg-[#1a1a1a] text-white px-6 py-4 rounded-xl text-[14px] font-bold transition-all duration-500 hover:bg-[#2a2a2a] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed mt-8 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? 'Authenticating...' : 'Access Portal'} <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
