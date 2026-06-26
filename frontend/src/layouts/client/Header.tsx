import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { clientProductApi, type CategorySummaryResponse } from '../../features/client/home/clientProductApi';
import { useAuth } from '../../features/auth/AuthProvider';
import { useCart } from '../../features/client/cart/CartProvider';
import { useDefaultShippingAddressLabel } from '../../features/client/addresses/hooks/useDefaultShippingAddressLabel';

const Header = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const { user, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const deliveryLabel = useDefaultShippingAddressLabel();
  const [isBouncing, setIsBouncing] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(cart?.totalItems || 0);

  const [searchQuery, setSearchQuery] = useState(keywordParam);
  const [categories, setCategories] = useState<CategorySummaryResponse[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery(keywordParam);
  }, [keywordParam]);

  useEffect(() => {
    clientProductApi
      .getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

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
    <>
    <div className="bg-blue-600 text-white text-sm py-2 text-center font-medium">
      Khuyến mãi đặc biệt: Giảm thêm 5% cho đơn hàng từ 5 triệu. Nhập mã NEXA5
    </div>
    <header className="bg-white border-b border-gray-100 py-4" data-purpose="primary-header">
      <div className="container-custom flex items-center justify-between gap-4 md:gap-8">
        <Link to="/" className="text-2xl md:text-3xl font-bold text-nexa-blue shrink-0">
          NexaMart
        </Link>

        {/* Search bar */}
        <div className="flex-grow max-w-2xl relative">
          <div className="flex items-center border-2 border-gray-200 rounded-md bg-white overflow-hidden focus-within:border-nexa-blue transition-colors">
            <input
              className="w-full px-4 py-2.5 outline-none border-none focus:ring-0 text-sm"
              placeholder="Tìm sản phẩm, thương hiệu hoặc danh mục"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              id="header-search-input"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center"
              aria-label="Tìm kiếm sản phẩm"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-400 gap-4 hidden sm:flex">
            <span className="cursor-pointer hover:text-nexa-blue" onClick={() => { setSearchQuery('Điện thoại Samsung'); navigate('/products?keyword=Điện+thoại+Samsung'); }}>Điện thoại Samsung</span>
            <span className="cursor-pointer hover:text-nexa-blue" onClick={() => { setSearchQuery('Tai nghe bluetooth'); navigate('/products?keyword=Tai+nghe+bluetooth'); }}>Tai nghe bluetooth</span>
            <span className="cursor-pointer hover:text-nexa-blue" onClick={() => { setSearchQuery('Laptop Dell'); navigate('/products?keyword=Laptop+Dell'); }}>Laptop Dell</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          {/* Category dropdown */}
          <div className="relative group cursor-pointer items-center gap-2 hover:text-nexa-blue transition-colors hidden md:flex">
            <i className="fa-solid fa-bars text-xl"></i>
            <span className="font-medium">Danh mục</span>

            <div className="absolute top-full left-0 mt-4 w-64 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-2 transition-all duration-300 z-50 border border-gray-100">
              <ul className="py-2 text-gray-700">
                {categories.length === 0 ? (
                  <li className="px-4 py-3 text-center text-gray-400 text-sm">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải...
                  </li>
                ) : (
                  categories.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                      className="px-4 py-2 hover:bg-gray-50 hover:text-nexa-blue transition-colors border-b border-gray-50 flex items-center justify-between last:border-b-0"
                    >
                      <span><i className="fa-solid fa-tag mr-2 w-5 text-gray-400"></i>{cat.name}</span>
                      <i className="fa-solid fa-chevron-right text-xs text-gray-400"></i>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Account */}
          <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 cursor-pointer hover:text-nexa-blue transition-colors no-underline text-inherit" title={user?.fullName || "Tài khoản"}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
            ) : (
              <i className="fa-regular fa-user text-xl"></i>
            )}
            <span className="text-sm font-medium hidden sm:inline max-w-[100px] truncate">{user ? user.fullName.split(' ').pop() || user.fullName : 'Tài khoản'}</span>
          </Link>

          {/* Cart */}
          <Link 
            to="/cart" 
            className="relative cursor-pointer hover:text-nexa-blue transition-colors no-underline text-inherit" 
            aria-label={`Giỏ hàng có ${cart?.totalItems ?? 0} sản phẩm`}
          >
            <i className="fa-solid fa-cart-shopping text-2xl text-gray-700 hover:text-nexa-blue transition-colors"></i>
            {cart && cart.totalItems > 0 && (
              <span 
                className={`absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center transform transition-transform ${isBouncing ? 'scale-125' : 'scale-100'}`}
                aria-live="polite"
              >
                {cart.totalItems > 99 ? '99+' : cart.totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
    <div className="bg-gray-50 border-b border-gray-100 py-2.5 hidden md:block">
      <div className="container-custom flex items-center text-sm text-gray-600 gap-1.5">
        <i className="fa-solid fa-location-dot text-gray-400"></i>
        <span>Giao đến: <strong className="text-gray-900">{deliveryLabel}</strong></span>
        <span className="mx-1 text-gray-300">|</span>
        <Link
          to={isAuthenticated ? '/account/addresses' : '/login?redirect=/account/addresses'}
          className="text-blue-600 hover:underline"
        >
          Thay đổi
        </Link>
      </div>
    </div>
    </>
  );
};

export default Header;
