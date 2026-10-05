import { db } from '../db/store';

export interface ReserveRequest {
    storeId: string;
    productId: string;
    quantity: number;
    customerId: string;
    idempotencyKey: string;
    expiryMinutes?: number;
}

export class InventoryService {
    /**
     * Performs an atomic reservation with optimistic locking and idempotency protection
     */
    static reserve(req: ReserveRequest) {
        if (!req.storeId || !req.productId || !req.customerId || !req.idempotencyKey) {
            throw new Error('Missing required parameters for inventory reservation');
        }
        if (req.quantity <= 0) {
            throw new Error('Quantity must be greater than zero');
        }

        return db.reserveStockAtomic(
            req.storeId,
            req.productId,
            req.quantity,
            req.customerId,
            req.idempotencyKey,
            req.expiryMinutes || 10
        );
    }

    /**
     * Releases an unconfirmed or expired reservation back to available stock
     */
    static release(reservationId: string) {
        return db.releaseReservation(reservationId);
    }

    /**
     * Fetches current stock info for a product across all physical stores
     */
    static getProductAvailability(productId: string) {
        return db.getProductStores(productId);
    }
}
