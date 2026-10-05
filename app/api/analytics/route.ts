import { NextResponse } from 'next/server';
import { analyticsService } from '@/lib/services/analytics';

export async function GET() {
    try {
        const metrics = await analyticsService.getPlatformMetrics();
        return NextResponse.json({ success: true, data: metrics });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
