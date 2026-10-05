import { db } from '../db/store';

export class CancellationService {
    /**
     * Executes the automated background cancellation job
     * Releases expired reservations (10 min timeout) & auto-cancels unpaid/uncollected COD pickup orders (24 hr timeout)
     */
    static runAutoCancellationScheduler() {
        return db.runAutoCancellationEngine();
    }

    /**
     * Manual customer/business cancellation request
     */
    static cancelOrder(orderId: string, userId: string, reason: string) {
        const order = db.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        // Cancellation policy check based on order status
        const cancellableStatuses = ['CREATED', 'PAYMENT_PENDING', 'CONFIRMED'];
        if (!cancellableStatuses.includes(order.status)) {
            throw new Error(`Order cannot be cancelled in '${order.status}' state according to SALESTORM cancellation policy.`);
        }

        return db.updateOrderStatus(orderId, 'CANCELLED', reason);
    }
}
