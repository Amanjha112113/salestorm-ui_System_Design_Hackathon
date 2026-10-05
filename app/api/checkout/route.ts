import { NextResponse } from 'next/server';
import { CheckoutService } from '@/lib/services/checkout';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            customerId = 'usr-customer-1',
            items,
            fulfilmentType,
            paymentMethod,
            deliveryAddress,
            userLocation,
            idempotencyKey,
        } = body;

        const key = idempotencyKey || `chk-${customerId}-${Date.now()}`;
        const res = CheckoutService.processCheckout({
            customerId,
            items,
            fulfilmentType,
            paymentMethod,
            deliveryAddress,
            userLocation,
            idempotencyKey: key,
        });

        if (!res.success) {
            return NextResponse.json({ success: false, error: { message: res.error } }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: { orders: res.orders } });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
    }
}
