import { apiClient } from '../../../api/apiClient';
import type { ApiResponse } from '../../../types/api';

import type { HomeBanner } from './types';

export const clientHomeBannerApi = {
  getActiveBanners: () => {
    return apiClient.get<ApiResponse<HomeBanner[]>>('/api/v1/client/home-banners');
  },
};
