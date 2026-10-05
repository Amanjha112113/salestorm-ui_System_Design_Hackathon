import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr-customer-1';
    const notifications = db.getNotifications(userId);
    return NextResponse.json({ success: true, data: notifications });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { id } = body;
    if (id) {
        db.markNotificationRead(id);
    }
    return NextResponse.json({ success: true });
}
