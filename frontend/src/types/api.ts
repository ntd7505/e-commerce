export type ApiResponse<T> = {
    success?: boolean;
    code: number;
    message: string;
    data: T;
    error?: {
        details?: Record<string, string>;
    };
    timestamp?: string;
};

export type PageResponse<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

export function unwrapApiList<T>(data: T[] | PageResponse<T> | null | undefined): T[] {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    return [];
}
