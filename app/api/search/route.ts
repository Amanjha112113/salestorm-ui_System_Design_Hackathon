import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { sortStoresByDistance, DEFAULT_USER_LOCATION } from '@/lib/services/location';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase() || '';
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');

    const userLoc = {
        city: DEFAULT_USER_LOCATION.city,
        latitude: latStr ? parseFloat(latStr) : DEFAULT_USER_LOCATION.latitude,
        longitude: lngStr ? parseFloat(lngStr) : DEFAULT_USER_LOCATION.longitude,
    };

    const allProducts = db.getProducts();
    const filteredProducts = q
        ? allProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.model.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                (p.category_name && p.category_name.toLowerCase().includes(q))
        )
        : allProducts;

    // Enrich each product result with store availability & distance
    const results = filteredProducts.map((product) => {
        const storeInventories = db.getProductStores(product.id);
        const availableStores = storeInventories
            .map((inv) => {
                if (!inv.store) return null;
                return {
                    store: inv.store,
                    available_quantity: inv.available_quantity,
                };
            })
            .filter(Boolean) as { store: any; available_quantity: number }[];

        const storesWithDistance = availableStores.map((item) => {
            const sorted = sortStoresByDistance([item.store], userLoc)[0];
            return {
                ...item,
                distance_km: sorted.distance_km,
            };
        }).sort((a, b) => a.distance_km - b.distance_km);

        return {
            ...product,
            stores: storesWithDistance,
            total_stock: availableStores.reduce((sum, s) => sum + s.available_quantity, 0),
        };
    });

    return NextResponse.json({ success: true, count: results.length, data: results });
}
