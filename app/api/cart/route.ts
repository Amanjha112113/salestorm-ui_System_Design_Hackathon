import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') || 'usr-customer-1';
    const items = db.getCart(customerId);
    return NextResponse.json({ success: true, data: items });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId = 'usr-customer-1', productId, storeId, quantity = 1 } = body;

        const item = db.addToCart(customerId, productId, storeId, quantity);
        return NextResponse.json({ success: true, data: item }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const customerId = searchParams.get('customerId') || 'usr-customer-1';

    if (itemId) {
        db.removeFromCart(itemId);
    } else {
        db.clearCart(customerId);
    }

    return NextResponse.json({ success: true });
}
