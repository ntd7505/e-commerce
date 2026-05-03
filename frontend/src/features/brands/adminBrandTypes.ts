export type BrandResponse = {
    id: number;
    name: string;
    logoUrl: string;
    slug: string;
    active: boolean;
};

export type BrandRequest = {
    name: string;
    logoUrl: string;
};

export type BrandCreateRequest = BrandRequest;

export type BrandStatusUpdateRequest = {
    active: boolean;
};
