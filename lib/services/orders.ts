import { Order, OrderStatus } from '@/lib/types';
import { db } from '@/lib/db/store';

export class OrderService {
    private static instance: OrderService;

    private constructor() { }

    public static getInstance(): OrderService {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    public async getOrders(customerId?: string, storeId?: string): Promise<Order[]> {
        if (storeId) return db.getOrdersByStore(storeId);
        return db.getOrders(customerId);
    }

    public async getOrderById(orderId: string): Promise<Order | null> {
        return db.getOrderById(orderId) || null;
    }

    public async updateOrderStatus(orderId: string, status: OrderStatus, reason?: string): Promise<Order | null> {
        return db.updateOrderStatus(orderId, status, reason);
    }

    public async cancelOrder(orderId: string, reason: string): Promise<{ success: boolean; order?: Order; error?: string }> {
        const order = db.getOrderById(orderId);
        if (!order) return { success: false, error: 'Order not found' };

        if (['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.status)) {
            return { success: false, error: `Order in status ${order.status} cannot be cancelled` };
        }

        const updated = db.updateOrderStatus(orderId, 'CANCELLED', reason);
        return { success: true, order: updated };
    }
}

export const orderService = OrderService.getInstance();
