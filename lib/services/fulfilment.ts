import { FulfilmentType } from '@/lib/types';

export class FulfilmentService {
    private static instance: FulfilmentService;

    private constructor() { }

    public static getInstance(): FulfilmentService {
        if (!FulfilmentService.instance) {
            FulfilmentService.instance = new FulfilmentService();
        }
        return FulfilmentService.instance;
    }

    public calculateCharges(type: FulfilmentType, distanceKm: number = 5): { deliveryCharge: number; shippingCharge: number } {
        if (type === 'PICKUP') {
            return { deliveryCharge: 0, shippingCharge: 0 };
        }
        if (type === 'LOCAL_DELIVERY') {
            const deliveryCharge = distanceKm <= 5 ? 49 : 49 + Math.round((distanceKm - 5) * 10);
            return { deliveryCharge, shippingCharge: 0 };
        }
        if (type === 'SHIPPING') {
            return { deliveryCharge: 0, shippingCharge: 149 };
        }
        return { deliveryCharge: 0, shippingCharge: 0 };
    }

    public generatePickupCode(): string {
        const code = Math.floor(1000 + Math.random() * 9000);
        return `PICKUP-${code}`;
    }
}

export const fulfilmentService = FulfilmentService.getInstance();
