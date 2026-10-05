import React from 'react';

interface StockBadgeProps {
    available: number;
}

export function StockBadge({ available }: StockBadgeProps) {
    if (available <= 0) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold badge-stock-out">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
                🔴 Out of Stock
            </span>
        );
    }

    if (available <= 5) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold badge-stock-low">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                🟡 Low Stock ({available} left)
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold badge-stock-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            🟢 In Stock ({available} available)
        </span>
    );
}
