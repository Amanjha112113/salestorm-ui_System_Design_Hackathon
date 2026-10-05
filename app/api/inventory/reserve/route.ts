import { NextResponse } from 'next/server';
import { InventoryService } from '@/lib/services/inventory';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { storeId, productId, quantity = 1, customerId = 'usr-customer-1', idempotencyKey } = body;

        const key = idempotencyKey || `res-${customerId}-${storeId}-${productId}-${Date.now()}`;
        const res = InventoryService.reserve({
            storeId,
            productId,
            quantity,
            customerId,
            idempotencyKey: key,
        });

        if (!res.success) {
            return NextResponse.json(
                { success: false, error: { code: res.error || 'RESERVATION_FAILED', message: res.message } },
                { status: res.error === 'OUT_OF_STOCK' ? 409 : 400 }
            );
        }

        return NextResponse.json({ success: true, data: res });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
    }
}
