import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr-customer-1';
    const conversations = db.getConversations(userId);
    return NextResponse.json({ success: true, data: conversations });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId = 'usr-customer-1', companyId, storeId, productId, message } = body;

        const conv = db.startConversation(customerId, companyId, storeId, productId);
        if (message) {
            db.sendMessage(conv.id, customerId, 'CUSTOMER', message);
        }

        return NextResponse.json({ success: true, data: conv }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
    }
}
