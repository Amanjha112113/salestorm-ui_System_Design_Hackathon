import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payments';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, amount, paymentMethod = 'ONLINE', idempotencyKey, simulateResult = 'SUCCESS' } = body;

        const key = idempotencyKey || `pay-${orderId}-${Date.now()}`;
        const res = PaymentService.processPayment({
            orderId,
            amount,
            paymentMethod,
            idempotencyKey: key,
            simulateResult,
        });

        return NextResponse.json({ success: res.success, data: res.payment, message: res.message });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
    }
}
