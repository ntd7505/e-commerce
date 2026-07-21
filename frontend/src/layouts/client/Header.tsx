import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, User, MapPin, ChevronDown, Check, Loader2 } from 'lucide-react';
import { cartApi } from '../../features/client/cart/cartApi';
import type { AddressResponse } from '../../features/client/cart/cartTypes';
import { useAuth } from '../../features/auth/AuthProvider';
import { useCart } from '../../features/client/cart/CartProvider';
import { useGuestDeliveryLocation } from '../../features/client/addresses/hooks/useGuestDeliveryLocation';
import type { GuestDeliveryLocation } from '../../features/client/addresses/hooks/useGuestDeliveryLocation';
import { buttonVariants } from '../../components/common/buttonVariants';

const Header = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const { user } = useAuth();
  const { cart, activeDeliveryAddress, setActiveDeliveryAddress } = useCart();
  const [isBouncing, setIsBouncing] = useState(false);
  const [prevTotalItems, setPrevTotalItems] = useState(cart?.totalItems || 0);

  const [searchQuery, setSearchQuery] = useState(keywordParam);

  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const locationMenuRef = React.useRef<HTMLDivElement>(null);
  const { location: guestLocation, setLocation: setGuestLocation, clearLocation: clearGuestLocation } = useGuestDeliveryLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target as Node)) {
        setShowLocationMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial load
      setLoadingAddresses(true);
      cartApi.getAddresses()
        .then(data => setAddresses(data.filter(a => !a.deleted)))
        .catch(console.error)
        .finally(() => setLoadingAddresses(false));
    } else {
      setAddresses([]);
    }
  }, [user]);

  const activeAddress = activeDeliveryAddress || addresses.find(a => a.isDefault) || addresses[0];
  
  let locationText = "Chọn khu vực giao hàng";
  if (user) {
    locationText = activeAddress ? `${activeAddress.districtName}, ${activeAddress.provinceName}` : "Chọn địa chỉ";
  } else if (guestLocation) {
    locationText = `${guestLocation.districtName}, ${guestLocation.provinceName}`;
  }

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
        
        {/* Left: Logo */}
        <div className="flex-1 min-w-0 flex items-center justify-start">
          <Link to="/" className="text-2xl font-bold tracking-tight shrink-0 no-underline">
            <span className="text-[var(--text-primary)]">Nexa</span><span className="text-[var(--color-primary)]">Mart</span>
          </Link>
        </div>

        {/* Center: Search bar */}
        <div className="flex-[2] max-w-[520px] relative hidden sm:block mx-auto w-full">
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

        {/* Right: Actions */}
        <div className="flex-1 min-w-0 flex items-center justify-end gap-4 md:gap-6 shrink-0">
          {/* Location */}
          <div 
            ref={locationMenuRef}
            className="relative flex items-center gap-1.5 text-[var(--text-secondary)] text-sm hidden md:flex"
          >
            <div 
              className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--text-primary)] transition-colors"
              onClick={() => setShowLocationMenu(!showLocationMenu)}
            >
              <MapPin className="w-5 h-5 text-[var(--text-primary)]" />
              <span className="max-w-[140px] truncate font-medium">{locationText}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </div>

            {/* Dropdown */}
            {showLocationMenu && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-[var(--surface-0)] border border-[var(--border)] shadow-lg rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {user ? (
                  <>
                    <div className="p-3 bg-[var(--surface-1)] border-b border-[var(--border)]">
                      <h4 className="font-bold text-[var(--text-primary)] text-sm">Địa chỉ giao hàng</h4>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[var(--border-strong)] scrollbar-track-transparent">
                      {loadingAddresses ? (
                        <div className="flex justify-center p-6"><Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" /></div>
                      ) : addresses.length === 0 ? (
                        <div className="p-6 text-center text-sm text-[var(--text-muted)]">Bạn chưa có địa chỉ nào.</div>
                      ) : (
                        addresses.map(addr => {
                          const isActive = activeAddress?.id === addr.id;
                          return (
                            <div 
                              key={addr.id}
                              className={`cursor-pointer block p-3 rounded-lg flex items-start gap-3 transition-colors no-underline mb-1 ${isActive ? 'bg-[var(--color-primary-soft)]' : 'hover:bg-[var(--surface-1)]'}`}
                              onClick={() => {
                                setActiveDeliveryAddress(addr);
                                setShowLocationMenu(false);
                              }}
                            >
                               <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--text-muted)]'}`} />
                               <div className="flex-1 min-w-0">
                                 <div className="font-bold text-[var(--text-primary)] text-sm mb-0.5 flex justify-between items-center gap-2">
                                   <span className="truncate">{addr.recipientName}</span>
                                   {isActive && <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0" />}
                                 </div>
                                 <div className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                   {addr.fullAddress}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                                 </div>
                               </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                ) : (
                  <GuestLocationSelector 
                    initialLocation={guestLocation}
                    onSave={(loc) => { setGuestLocation(loc); setShowLocationMenu(false); }}
                    onClear={() => { clearGuestLocation(); setShowLocationMenu(false); }}
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Account */}
          <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 text-[var(--text-secondary)] text-sm cursor-pointer hover:text-[var(--text-primary)] transition-colors no-underline">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="w-5 h-5 rounded-full object-cover border border-[var(--border)]" />
            ) : (
              <User className="w-5 h-5 text-[var(--text-primary)]" />
            )}
            <span className="hidden sm:inline">{user ? user.fullName.split(' ').pop() || user.fullName : 'Khách'}</span>
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

function GuestLocationSelector({ 
  initialLocation, 
  onSave, 
  onClear 
}: { 
  initialLocation: GuestDeliveryLocation | null, 
  onSave: (loc: GuestDeliveryLocation) => void, 
  onClear: () => void 
}) {
  const [provinceName, setProvinceName] = React.useState(initialLocation?.provinceName || '');
  const [districtName, setDistrictName] = React.useState(initialLocation?.districtName || '');
  const [wardName, setWardName] = React.useState(initialLocation?.wardName || '');
  const [error, setError] = React.useState('');

  const handleSave = () => {
    const p = provinceName.trim();
    const d = districtName.trim();
    const w = wardName.trim();
    if (!p || !d) {
      setError('Vui lòng nhập Tỉnh/Thành phố và Quận/Huyện');
      return;
    }
    setError('');
    onSave({ provinceName: p, districtName: d, wardName: w });
  };

  return (
    <div className="p-4 bg-[var(--surface-0)]">
      <h4 className="font-bold text-[var(--text-primary)] text-sm mb-4">Khu vực giao hàng</h4>
      {error && <p className="text-[var(--color-danger)] text-xs mb-3">{error}</p>}
      <div className="flex flex-col gap-3">
        <div>
          <input 
            type="text" 
            placeholder="Tỉnh/Thành phố" 
            value={provinceName}
            onChange={e => setProvinceName(e.target.value)}
            className="w-full bg-[var(--surface-0)] border border-[var(--border)] rounded-md px-3 h-9 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Quận/Huyện" 
            value={districtName}
            onChange={e => setDistrictName(e.target.value)}
            className="w-full bg-[var(--surface-0)] border border-[var(--border)] rounded-md px-3 h-9 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Phường/Xã (không bắt buộc)" 
            value={wardName}
            onChange={e => setWardName(e.target.value)}
            className="w-full bg-[var(--surface-0)] border border-[var(--border)] rounded-md px-3 h-9 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button 
            type="button"
            onClick={handleSave}
            className={buttonVariants({ variant: 'primary', size: 'sm', fullWidth: true })}
          >
            Lưu khu vực
          </button>
          {initialLocation && (
            <button 
              type="button"
              onClick={onClear}
              className={buttonVariants({ variant: 'outline', size: 'sm', fullWidth: true })}
            >
              Xóa lựa chọn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
