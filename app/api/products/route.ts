import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const storeId = searchParams.get('storeId');

    let products = db.getProducts();

    if (categoryId) {
        products = products.filter((p) => p.category_id === categoryId);
    }

    if (storeId) {
        const storeInventory = db.getStoreInventoryList(storeId);
        const storeProductIds = new Set(storeInventory.map((inv) => inv.product_id));
        products = products.filter((p) => storeProductIds.has(p.id));
    }

    return NextResponse.json({ success: true, data: products });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const product = db.createProduct(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
    }
}
