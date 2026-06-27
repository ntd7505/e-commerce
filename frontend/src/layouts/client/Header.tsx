import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider';
import { useCart } from '../../features/client/cart/CartProvider';

const Header = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const { user } = useAuth();
  const { cart } = useCart();
  const [isBouncing, setIsBouncing] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(cart?.totalItems || 0);

  const [searchQuery, setSearchQuery] = useState(keywordParam);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(keywordParam);
  }, [keywordParam]);



  useEffect(() => {
    if (cart && cart.totalItems !== prevTotalItems) {
      if (cart.totalItems > prevTotalItems) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsBouncing(true);
        const timer = setTimeout(() => setIsBouncing(false), 300);
        return () => clearTimeout(timer);
      }
      setPrevTotalItems(cart.totalItems);
    }
  }, [cart, prevTotalItems]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/products?keyword=${encodeURIComponent(query)}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="bg-[var(--surface-2)] border-b border-[var(--border)] py-4" data-purpose="primary-header">
      <div className="container-custom flex items-center justify-between gap-4 md:gap-5">
        <Link to="/" className="text-2xl font-bold tracking-tight shrink-0 no-underline">
          <span className="text-[var(--text-primary)]">Nexa</span><span className="text-[var(--color-primary)]">Mart</span>
        </Link>

        {/* Search bar */}
        <div className="flex-grow max-w-[520px] relative hidden sm:block">
          <div className="flex items-center bg-[var(--surface-0)] border-[0.5px] border-[var(--border)] rounded-md px-3 h-10 transition-colors">
            <Search className="w-4 h-4 text-[var(--text-muted)] mr-2 shrink-0" />
            <input
              className="flex-1 bg-transparent border-none text-sm text-[var(--text-primary)] outline-none placeholder-[var(--text-muted)] w-full"
              placeholder="Tìm kiếm sản phẩm..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              id="header-search-input"
            />
            <button
              onClick={handleSearch}
              className="px-4 bg-[var(--color-primary)] text-white rounded cursor-pointer transition-colors flex items-center justify-center text-sm font-medium h-[32px] hover:bg-[var(--color-primary-hover)] border-0"
              aria-label="Tìm kiếm sản phẩm"
            >
              Tìm
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Location */}
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm cursor-pointer hover:text-[var(--text-primary)] transition-colors hidden md:flex">
            <MapPin className="w-5 h-5 text-[var(--text-primary)]" />
            <span>Thanh Xuân, HN</span>
          </div>
          
          {/* Account */}
          <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 text-[var(--text-secondary)] text-sm cursor-pointer hover:text-[var(--text-primary)] transition-colors no-underline">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="w-5 h-5 rounded-full object-cover border border-[var(--border)]" />
            ) : (
              <User className="w-5 h-5 text-[var(--text-primary)]" />
            )}
            <span className="hidden sm:inline">{user ? user.fullName.split(' ').pop() || user.fullName : 'admin'}</span>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center cursor-pointer hover:text-[var(--text-primary)] transition-colors no-underline text-inherit"
            aria-label={`Giỏ hàng có ${cart?.totalItems ?? 0} sản phẩm`}
          >
            <ShoppingCart className="w-5 h-5 text-[var(--text-primary)]" />
            {cart && cart.totalItems > 0 && (
              <span
                className={`absolute -top-1.5 -right-2 bg-[var(--color-danger)] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${isBouncing ? 'scale-125' : 'scale-100'}`}
                aria-live="polite"
              >
                {cart.totalItems > 99 ? '99+' : cart.totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
