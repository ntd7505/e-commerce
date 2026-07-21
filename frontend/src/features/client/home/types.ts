export type BannerPosition = 'HOME_HERO' | 'HOME_SIDE_TOP' | 'HOME_SIDE_BOTTOM';

export const BannerPosition = {
  HOME_HERO: 'HOME_HERO' as const,
  HOME_SIDE_TOP: 'HOME_SIDE_TOP' as const,
  HOME_SIDE_BOTTOM: 'HOME_SIDE_BOTTOM' as const,
};

export interface ProductSummary {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  price?: number;
  salePrice?: number;
}

export interface HomeBanner {
  id: number;
  position: BannerPosition;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  backgroundColor?: string;
  sortOrder: number;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  product: ProductSummary;
}
