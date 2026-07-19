import { apiClient } from '../../../api/apiClient';
import type { ApiResponse, PageResponse } from '../../../types/api';

import type {
  HomeBanner,
  HomeBannerRequest,
  HomeBannerStatusRequest,
  ReorderBannersRequest,
} from './types';
import { BannerPosition } from './types';

export const adminHomeBannerApi = {
  getBanners: (params?: { page?: number; size?: number; position?: BannerPosition; active?: boolean }) => {
    return apiClient.get<ApiResponse<PageResponse<HomeBanner>>>('/api/v1/admin/home-banners', { params });
  },

  getBanner: (id: number) => {
    return apiClient.get<ApiResponse<HomeBanner>>(`/api/v1/admin/home-banners/${id}`);
  },

  createBanner: (data: HomeBannerRequest) => {
    return apiClient.post<ApiResponse<HomeBanner>>('/api/v1/admin/home-banners', data);
  },

  updateBanner: (id: number, data: HomeBannerRequest) => {
    return apiClient.patch<ApiResponse<HomeBanner>>(`/api/v1/admin/home-banners/${id}`, data);
  },

  updateBannerStatus: (id: number, data: HomeBannerStatusRequest) => {
    return apiClient.patch<ApiResponse<HomeBanner>>(`/api/v1/admin/home-banners/${id}/status`, data);
  },

  deleteBanner: (id: number) => {
    return apiClient.delete<ApiResponse<void>>(`/api/v1/admin/home-banners/${id}`);
  },

  reorderHeroBanners: (data: ReorderBannersRequest) => {
    return apiClient.put<ApiResponse<void>>('/api/v1/admin/home-banners/reorder', data);
  },
};
