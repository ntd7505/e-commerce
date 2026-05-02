export type BrandResponse = {
    id: number;
    name: string;
    logoUrl: string;
    slug: string;
    active: boolean;
};

export type BrandCreateRequest = {
    name: string;
    logoUrl: string;
}
