import { NextResponse } from 'next/server';
import { backgroundWorkerSuite } from '@/lib/services/workers';

export async function POST() {
    try {
        const result = await backgroundWorkerSuite.runAllWorkers();
        return NextResponse.json({ success: true, data: result });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
