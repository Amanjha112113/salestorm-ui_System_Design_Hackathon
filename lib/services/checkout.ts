import { db } from '../db/store';
import { FulfilmentType, PaymentMethod, Order, UserLocation } from '../types';
import { calculateHaversineDistance, calculateDeliveryCharge } from './location';
import { InventoryService } from './inventory';

export interface CheckoutRequest {
    customerId: string;
    items: {
        productId: string;
        storeId: string;
        quantity: number;
    }[];
    fulfilmentType: FulfilmentType;
    paymentMethod: PaymentMethod;
    deliveryAddress?: string;
    userLocation?: UserLocation;
    idempotencyKey: string;
}

export class CheckoutService {
    /**
     * Processes multi-store checkout, performs atomic inventory reservations,
     * calculates distance/delivery fees, splits into store-specific orders, and completes order creation.
     */
    static processCheckout(req: CheckoutRequest): { success: boolean; orders: Order[]; error?: string } {
        if (!req.items || req.items.length === 0) {
            return { success: false, orders: [], error: 'Cart is empty' };
        }

        // 1. Group items by storeId (Multi-Store Cart Splitter)
        const storeMap = new Map<string, typeof req.items>();
        for (const item of req.items) {
            const group = storeMap.get(item.storeId) || [];
            group.push(item);
            storeMap.set(item.storeId, group);
        }

        const createdOrders: Order[] = [];

        // Process each store group as an independent store-specific order
        for (const [storeId, storeItems] of storeMap.entries()) {
            const store = db.getStoreById(storeId);
            if (!store) {
                return { success: false, orders: [], error: `Store ${storeId} not found` };
            }

            let subtotal = 0;
            const orderItems = [];

            // Atomic inventory reservation step
            for (const item of storeItems) {
                const product = db.getProductById(item.productId);
                if (!product) {
                    return { success: false, orders: [], error: `Product ${item.productId} not found` };
                }

                const resKey = `${req.idempotencyKey}-${storeId}-${item.productId}`;
                const reserveRes = InventoryService.reserve({
                    storeId,
                    productId: item.productId,
                    quantity: item.quantity,
                    customerId: req.customerId,
                    idempotencyKey: resKey,
                });

                if (!reserveRes.success) {
                    return {
                        success: false,
                        orders: [],
                        error: `Failed to reserve product '${product.name}' at store '${store.name}': ${reserveRes.message || reserveRes.error}`,
                    };
                }

                const itemSubtotal = product.price * item.quantity;
                subtotal += itemSubtotal;

                orderItems.push({
                    id: `orditem-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                    order_id: '', // set upon order creation
                    product_id: item.productId,
                    quantity: item.quantity,
                    unit_price: product.price,
                    subtotal: itemSubtotal,
                    product,
                });
            }

            // Calculate delivery or shipping charge
            let deliveryCharge = 0;
            let shippingCharge = 0;

            if (req.fulfilmentType === 'LOCAL_DELIVERY') {
                const userLoc = req.userLocation || { latitude: store.latitude, longitude: store.longitude, city: store.city };
                const distanceKm = calculateHaversineDistance(userLoc.latitude, userLoc.longitude, store.latitude, store.longitude);
                deliveryCharge = calculateDeliveryCharge(distanceKm);
            } else if (req.fulfilmentType === 'SHIPPING') {
                shippingCharge = 149; // Standard domestic shipping flat rate
            }

            const totalAmount = subtotal + deliveryCharge + shippingCharge;
            const initialStatus = req.paymentMethod === 'COD' ? 'CONFIRMED' : 'PAYMENT_PENDING';

            // Create order
            const order = db.createOrder({
                customer_id: req.customerId,
                store_id: storeId,
                subtotal,
                delivery_charge: deliveryCharge,
                shipping_charge: shippingCharge,
                total_amount: totalAmount,
                payment_method: req.paymentMethod,
                fulfilment_type: req.fulfilmentType,
                status: initialStatus,
                delivery_address: req.deliveryAddress,
                items: orderItems,
                store,
            });

            createdOrders.push(order);
        }

        // Clear cart after successful checkout
        db.clearCart(req.customerId);

        return {
            success: true,
            orders: createdOrders,
        };
    }
}
