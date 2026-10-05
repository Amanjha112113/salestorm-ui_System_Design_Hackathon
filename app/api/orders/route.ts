import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const storeId = searchParams.get('storeId');

    if (storeId) {
        const storeOrders = db.getOrdersByStore(storeId);
        return NextResponse.json({ success: true, data: storeOrders });
    }

    const orders = db.getOrders(customerId || undefined);
    return NextResponse.json({ success: true, data: orders });
}
