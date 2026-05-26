export type CancelRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type OrderCancelRequestResponse = {
    id: number;
    orderId: number;
    reason: string;
    status: CancelRequestStatus;
    requestedBy: number;
    reviewedBy: number | null;
    reviewNote: string | null;
    requestedAt: string;
    reviewedAt: string | null;
};
