import { Store, UserLocation } from '../types';

/**
 * Calculates Haversine distance in kilometers between two lat/lon coordinates
 */
export function calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Sorts stores by distance from customer's selected location
 */
export function sortStoresByDistance<T extends Store>(
    stores: T[],
    userLoc: UserLocation
): (T & { distance_km: number })[] {
    return stores
        .map((store) => {
            const distance = calculateHaversineDistance(
                userLoc.latitude,
                userLoc.longitude,
                store.latitude,
                store.longitude
            );
            return {
                ...store,
                distance_km: distance,
            };
        })
        .sort((a, b) => a.distance_km - b.distance_km);
}

/**
 * Calculates local delivery charges based on distance tier
 * Tier 1 (0–5 km): ₹49
 * Tier 2 (5–10 km): ₹79
 * Tier 3 (10–20 km): ₹129
 * Tier 4 (>20 km): ₹199
 */
export function calculateDeliveryCharge(distanceKm: number): number {
    if (distanceKm <= 5) return 49;
    if (distanceKm <= 10) return 79;
    if (distanceKm <= 20) return 129;
    return 199;
}

export const DEFAULT_USER_LOCATION: UserLocation = {
    city: 'Tirunelveli',
    latitude: 8.7139,
    longitude: 77.7567,
    pincode: '627005',
};
