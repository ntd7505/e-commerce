export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
    timestamp?: string;
};

type PageResponse<T> = {
    content?: T[];
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
