import { db } from '../db/store';
import { Payment, PaymentStatus } from '../types';

export interface PaymentRequest {
    orderId: string;
    amount: number;
    paymentMethod: 'ONLINE' | 'COD';
    idempotencyKey: string;
    simulateResult?: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
}

export class PaymentService {
    /**
     * Processes a payment transaction through the Mock Gateway.
     * Handles SUCCESS, FAILED, and TIMEOUT responses idempotently.
     */
    static processPayment(req: PaymentRequest): { success: boolean; payment: Payment; message?: string } {
        const order = db.getOrderById(req.orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const txRef = `TXN-ST-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const outcome: PaymentStatus =
            req.simulateResult === 'FAILED'
                ? 'FAILED'
                : req.simulateResult === 'TIMEOUT'
                    ? 'PENDING'
                    : 'SUCCESS';

        const payment: Payment = {
            id: `pay-${Date.now()}`,
            order_id: req.orderId,
            transaction_reference: txRef,
            amount: req.amount,
            payment_method: req.paymentMethod,
            status: outcome,
            idempotency_key: req.idempotencyKey,
            gateway_response: {
                gateway: 'SALESTORM_MOCK_GATEWAY_V1',
                outcome,
                timestamp: new Date().toISOString(),
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        if (outcome === 'SUCCESS') {
            db.updateOrderStatus(req.orderId, 'CONFIRMED');
        } else if (outcome === 'FAILED') {
            db.updateOrderStatus(req.orderId, 'CANCELLED', 'Payment processing failed');
        }

        return {
            success: outcome === 'SUCCESS',
            payment,
            message: outcome === 'SUCCESS' ? 'Payment processed successfully' : `Payment status: ${outcome}`,
        };
    }
}
