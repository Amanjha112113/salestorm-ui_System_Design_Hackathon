import { NextResponse } from 'next/server';
import { CancellationService } from '@/lib/services/cancellation';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { userId = 'usr-customer-1', reason = 'Cancelled by customer' } = body;

        const cancelledOrder = CancellationService.cancelOrder(params.id, userId, reason);
        return NextResponse.json({ success: true, data: cancelledOrder });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
    }
}
