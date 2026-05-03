export type CategoryParentResponse = {
    id: number;
    name: string;
    slug: string;
};

export type CategoryChildResponse = {
    id: number;
    name: string;
    slug: string;
    active: boolean;
};

export type CategoryResponse = {
    id: number;
    name: string;
    description: string | null;
    slug: string;
    active: boolean;
    parent: CategoryParentResponse | null;
    children: CategoryChildResponse[];
};

export type CategoryRequest = {
    name: string;
    description?: string;
    parentCategoryId?: number | null;
};         