import { Reservation } from '@/lib/types';
import { InventoryService } from '@/lib/services/inventory';

export class ReservationService {
    private static instance: ReservationService;

    private constructor() { }

    public static getInstance(): ReservationService {
        if (!ReservationService.instance) {
            ReservationService.instance = new ReservationService();
        }
        return ReservationService.instance;
    }

    public async reserveStock(params: {
        customerId: string;
        storeId: string;
        productId: string;
        quantity: number;
        idempotencyKey: string;
        ttlMinutes?: number;
    }) {
        return InventoryService.reserve({
            storeId: params.storeId,
            productId: params.productId,
            quantity: params.quantity,
            customerId: params.customerId,
            idempotencyKey: params.idempotencyKey,
            expiryMinutes: params.ttlMinutes,
        });
    }
}

export const reservationService = ReservationService.getInstance();
