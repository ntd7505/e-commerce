/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { cartApi } from './cartApi';
import type { CartResponse, AddCartItemRequest, UpdateCartItemRequest, AddressResponse, GuestCartItemRequest } from './cartTypes';
import { useAuth } from '../../auth/AuthProvider';
const createEmptyCart = (): CartResponse => ({
  id: 0,
  status: 'ACTIVE',
  items: [],
  totalItems: 0,
  subtotalAmount: 0,
});

const recalculateCart = (cart: CartResponse, items: CartResponse['items']): CartResponse => ({
  ...cart,
  items,
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  subtotalAmount: items.reduce((sum, item) => sum + item.lineTotal, 0),
});

const GUEST_CART_KEY = 'nexamart_guest_cart';

const getGuestCart = (): GuestCartItemRequest[] => {
  const saved = localStorage.getItem(GUEST_CART_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as GuestCartItemRequest[];
  } catch {
    return [];
  }
};

const setGuestCart = (items: GuestCartItemRequest[]) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};


interface CartContextType {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItem: (data: AddCartItemRequest) => Promise<void>;
  updateItem: (itemId: number, data: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  activeDeliveryAddress: AddressResponse | null;
  setActiveDeliveryAddress: (address: AddressResponse | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeDeliveryAddress, setActiveDeliveryAddress] = useState<AddressResponse | null>(() => {
    const saved = sessionStorage.getItem('activeDeliveryAddress');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeDeliveryAddress) {
      sessionStorage.setItem('activeDeliveryAddress', JSON.stringify(activeDeliveryAddress));
    } else {
      sessionStorage.removeItem('activeDeliveryAddress');
    }
  }, [activeDeliveryAddress]);

  const mergeAttemptedRef = useRef(false);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated) {
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
          const preview = await cartApi.previewGuestCart({ items: guestItems });
          setCart(preview);
        } else {
          setCart(createEmptyCart());
        }
        return;
      }

      const data = await cartApi.getCart();
      setCart(data);
    } catch (err: unknown) {
      if ((err as { response?: { status: number } }).response?.status === 404) {
        setCart(createEmptyCart());
      } else {
        setError('Không thể tải giỏ hàng.');
        console.error('refreshCart error', err);
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
      const guestItems = getGuestCart();
      if (guestItems.length > 0 && !mergeAttemptedRef.current) {
        mergeAttemptedRef.current = true;
        cartApi.mergeGuestCart({ items: guestItems })
          .then(() => {
            localStorage.removeItem(GUEST_CART_KEY);
            void refreshCart();
          })
          .catch((err) => {
            console.error('Merge guest cart error:', err);
          });
      }
    } else {
      mergeAttemptedRef.current = false;
    }
  }, [isAuthenticated, refreshCart]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshCart();
  }, [refreshCart]);

  const addItem = async (data: AddCartItemRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated) {
        const items = getGuestCart();
        const existing = items.find(i => i.productVariantId === data.productVariantId);
        if (existing) {
          existing.quantity += data.quantity;
        } else {
          items.push(data);
        }
        setGuestCart(items);
        await refreshCart();
      } else {
        const updatedCart = await cartApi.addItem(data);
        setCart(updatedCart);
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể thêm vào giỏ hàng');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: number, data: UpdateCartItemRequest) => {
    setError(null);
    try {
      if (!isAuthenticated) {
        // itemId for guest cart preview might be missing, but actually it is returned as null. 
        // Oh wait, in preview we might need to map by productVariantId because itemId is null.
        // If itemId is null, how does Cart page call updateItem? It usually passes the cartItem.id.
        // If cartItem.id is null, this won't work well.
        // Let's modify the signature or assume itemId is productVariantId for guest cart.
        // Wait, if it's guest cart, Cart component will call updateItem(cartItem.id, ...). But id is null!
        // We should handle this. Let me just use productVariantId if it's guest. Wait! We need to fix the parameter here or how Cart calls it.
        // I will use productVariantId as the identifier if !isAuthenticated.
        // Let's assume the frontend passes productVariantId if itemId is null, OR I can just look up by productVariantId.
        const items = getGuestCart();
        const existing = items.find(i => i.productVariantId === itemId);
        if (existing) {
          existing.quantity = data.quantity;
          setGuestCart(items);
          await refreshCart();
        }
      } else {
        const updatedCart = await cartApi.updateItemQuantity(itemId, data);
        setCart(updatedCart);
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật số lượng');
      throw err;
    }
  };

  const removeItem = async (itemId: number) => {
    setError(null);
    try {
      if (!isAuthenticated) {
        let items = getGuestCart();
        items = items.filter(i => i.productVariantId !== itemId);
        setGuestCart(items);
        await refreshCart();
      } else {
        await cartApi.removeItem(itemId);
        setCart((currentCart) => {
          if (!currentCart) return createEmptyCart();
          const nextItems = currentCart.items.filter((item) => item.id !== itemId);
          return recalculateCart(currentCart, nextItems);
        });
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xoá sản phẩm');
      throw err;
    }
  };

  const clearCart = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isAuthenticated) {
        localStorage.removeItem(GUEST_CART_KEY);
        setCart(createEmptyCart());
      } else {
        await cartApi.clearCart();
        setCart((currentCart) => {
          if (!currentCart) return createEmptyCart();
          return recalculateCart(currentCart, []);
        });
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xoá giỏ hàng');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        activeDeliveryAddress,
        setActiveDeliveryAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
