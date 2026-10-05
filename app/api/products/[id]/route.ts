import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const product = db.getProductById(params.id);
    if (!product) {
        return NextResponse.json({ success: false, error: { message: 'Product not found' } }, { status: 404 });
    }

    const storesWithStock = db.getProductStores(params.id);

    return NextResponse.json({
        success: true,
        data: {
            ...product,
            available_stores: storesWithStock,
        },
    });
}
