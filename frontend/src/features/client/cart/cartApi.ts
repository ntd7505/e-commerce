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
  OrderBasicResponse
} from './cartTypes';

export const cartApi = {
  // Cart
  getCart: async (): Promise<CartResponse> => {
    const res = await apiClient.get<ApiResponse<CartResponse>>('/api/v1/client/cart');
    console.log('CART RESPONSE:', res.data.data);
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

  // Addresses
  getAddresses: async (): Promise<AddressResponse[]> => {
    const res = await apiClient.get<ApiResponse<AddressResponse[]>>('/api/v1/client/addresses');
    return res.data.data;
  },

  createAddress: async (data: AddressRequest): Promise<AddressResponse> => {
    const res = await apiClient.post<ApiResponse<AddressResponse>>('/api/v1/client/addresses', data);
    return res.data.data;
  },

  updateAddress: async (id: number, data: AddressRequest): Promise<AddressResponse> => {
    const res = await apiClient.patch<ApiResponse<AddressResponse>>(`/api/v1/client/addresses/${id}`, data);
    return res.data.data;
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

  getOrderBasic: async (orderId: number | string): Promise<OrderBasicResponse> => {
    const res = await apiClient.get<ApiResponse<OrderBasicResponse>>(`/api/v1/client/orders/${orderId}`);
    return res.data.data;
  }
};
