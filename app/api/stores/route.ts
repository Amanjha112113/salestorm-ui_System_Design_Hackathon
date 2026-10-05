import { NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { sortStoresByDistance, DEFAULT_USER_LOCATION } from '@/lib/services/location';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');

    let stores = db.getStores();

    if (city) {
        stores = stores.filter((s) => s.city.toLowerCase() === city.toLowerCase());
    }

    const userLoc = {
        city: city || DEFAULT_USER_LOCATION.city,
        latitude: latStr ? parseFloat(latStr) : DEFAULT_USER_LOCATION.latitude,
        longitude: lngStr ? parseFloat(lngStr) : DEFAULT_USER_LOCATION.longitude,
    };

    const sortedStores = sortStoresByDistance(stores, userLoc);

    return NextResponse.json({ success: true, data: sortedStores });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newStore = db.createStore(body);
        return NextResponse.json({ success: true, data: newStore }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
    }
}
