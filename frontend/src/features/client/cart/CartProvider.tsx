/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { cartApi } from './cartApi';
import type { CartResponse, AddCartItemRequest, UpdateCartItemRequest, AddressResponse } from './cartTypes';
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

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err: unknown) {
      // Bỏ qua lỗi 404 (Cart not found - chưa có cart)
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
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshCart();
  }, [refreshCart]);

  const addItem = async (data: AddCartItemRequest) => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await cartApi.addItem(data);
      setCart(updatedCart);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể thêm vào giỏ hàng');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: number, data: UpdateCartItemRequest) => {
    if (!isAuthenticated) return;
    setError(null);
    try {
      const updatedCart = await cartApi.updateItemQuantity(itemId, data);
      setCart(updatedCart);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật số lượng');
      throw err;
    }
  };

  const removeItem = async (itemId: number) => {
    if (!isAuthenticated) return;
    setError(null);
    try {
      await cartApi.removeItem(itemId);
      setCart((currentCart) => {
        if (!currentCart) return createEmptyCart();
        const nextItems = currentCart.items.filter((item) => item.id !== itemId);
        return recalculateCart(currentCart, nextItems);
      });
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xoá sản phẩm');
      throw err;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    setError(null);
    setLoading(true);
    try {
      await cartApi.clearCart();
      setCart((currentCart) => {
        if (!currentCart) return createEmptyCart();
        return recalculateCart(currentCart, []);
      });
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
