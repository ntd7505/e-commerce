type AdminSkeletonTableProps = {
    columns: number;
    rows?: number;
};

export function AdminSkeletonTable({ columns, rows = 5 }: AdminSkeletonTableProps) {
    return (
        <div className="w-full animate-pulse px-5 py-4">
            <div className="mb-3 h-8 w-full rounded bg-gray-100" />
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="mb-3 flex gap-4">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="h-5 flex-1 rounded bg-gray-100"
                            style={{ flexBasis: `${100 / columns}%` }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
