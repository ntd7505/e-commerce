import { publicClient } from '../../../api/publicClient';
import type { ApiResponse } from '../../../types/api';

import type { HomeBanner } from './types';

export const clientHomeBannerApi = {
  getActiveBanners: () => {
    return publicClient.get<ApiResponse<HomeBanner[]>>('/api/v1/client/home-banners');
  },
};
