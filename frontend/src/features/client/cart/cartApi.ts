import { apiClient } from '../../../api/apiClient';
import type { ApiResponse } from '../../../types/api';
import type { 
  CartResponse, 
  AddCartItemRequest, 
  UpdateCartItemRequest,
  AddressResponse,
  AddressRequest,
  CheckoutPreviewRequest,
  CheckoutPreviewResponse,
  CreateOrderRequest,
  OrderBasicResponse,
  CouponResponse,
  CouponValidationResponse,
  GuestCartRequest
} from './cartTypes';

export const cartApi = {
  // Cart
  getCart: async (): Promise<CartResponse> => {
    const res = await apiClient.get<ApiResponse<CartResponse>>('/api/v1/client/cart');
    return res.data.data;
  },

  addItem: async (data: AddCartItemRequest): Promise<CartResponse> => {
    const res = await apiClient.post<ApiResponse<CartResponse>>('/api/v1/client/cart/items', data);
    return res.data.data;
  },

  updateItemQuantity: async (itemId: number, data: UpdateCartItemRequest): Promise<CartResponse> => {
    const res = await apiClient.patch<ApiResponse<CartResponse>>(`/api/v1/client/cart/items/${itemId}`, data);
    return res.data.data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/api/v1/client/cart/items/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>('/api/v1/client/cart/items');
  },

  previewGuestCart: async (data: GuestCartRequest): Promise<CartResponse> => {
    const res = await apiClient.post<ApiResponse<CartResponse>>('/api/v1/client/cart/guest/preview', data);
    return res.data.data;
  },

  mergeGuestCart: async (data: GuestCartRequest): Promise<CartResponse> => {
    const res = await apiClient.post<ApiResponse<CartResponse>>('/api/v1/client/cart/merge', data);
    return res.data.data;
  },

  // Addresses
  getAddresses: async (): Promise<AddressResponse[]> => {
    const res = await apiClient.get<ApiResponse<unknown[]>>('/api/v1/client/addresses');
    return (res.data.data as Array<Record<string, unknown>>).map((addr) => ({
      ...addr,
      isDefault: addr.isDefault ?? addr.default
    })) as AddressResponse[];
  },

  createAddress: async (data: AddressRequest): Promise<AddressResponse> => {
    const res = await apiClient.post<ApiResponse<Record<string, unknown>>>('/api/v1/client/addresses', data);
    const addr = res.data.data;
    return { ...addr, isDefault: addr.isDefault ?? addr.default } as AddressResponse;
  },

  updateAddress: async (id: number, data: AddressRequest): Promise<AddressResponse> => {
    const res = await apiClient.patch<ApiResponse<Record<string, unknown>>>(`/api/v1/client/addresses/${id}`, data);
    const addr = res.data.data;
    return { ...addr, isDefault: addr.isDefault ?? addr.default } as AddressResponse;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/client/addresses/${id}`);
  },

  // Checkout
  previewCheckout: async (data: CheckoutPreviewRequest): Promise<CheckoutPreviewResponse> => {
    const res = await apiClient.post<ApiResponse<CheckoutPreviewResponse>>('/api/v1/client/checkout/preview', data);
    return res.data.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<OrderBasicResponse> => {
    const res = await apiClient.post<ApiResponse<OrderBasicResponse>>('/api/v1/client/orders', data);
    return res.data.data;
  },

  previewBuyNowOrder: async (data: import('./cartTypes').BuyNowPreviewRequest): Promise<CheckoutPreviewResponse> => {
    const res = await apiClient.post<ApiResponse<CheckoutPreviewResponse>>('/api/v1/client/checkout/buy-now/preview', data);
    return res.data.data;
  },

  createBuyNowOrder: async (data: import('./cartTypes').BuyNowCheckoutRequest): Promise<OrderBasicResponse> => {
    const res = await apiClient.post<ApiResponse<OrderBasicResponse>>('/api/v1/client/orders/buy-now', data);
    return res.data.data;
  },

  getOrderBasic: async (orderId: number | string): Promise<OrderBasicResponse> => {
    const res = await apiClient.get<ApiResponse<OrderBasicResponse>>(`/api/v1/client/orders/${orderId}`);
    return res.data.data;
  },

  // Coupons
  getAvailableCoupons: async (): Promise<CouponResponse[]> => {
    const res = await apiClient.get<ApiResponse<CouponResponse[]>>('/api/v1/client/coupons/available');
    return res.data.data;
  },

  validateCoupon: async (data: { code: string; subtotalAmount: number }): Promise<CouponValidationResponse> => {
    const res = await apiClient.post<ApiResponse<CouponValidationResponse>>('/api/v1/client/coupons/validate', data);
    return res.data.data;
  }
};
