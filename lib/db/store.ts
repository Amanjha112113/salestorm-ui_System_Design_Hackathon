import {
    Profile,
    Company,
    Store,
    Category,
    Product,
    StoreInventory,
    Reservation,
    CartItem,
    Order,
    Payment,
    Shipment,
    Conversation,
    Message,
    Notification,
} from '../types';
import {
    INITIAL_PROFILES,
    INITIAL_COMPANIES,
    INITIAL_STORES,
    INITIAL_CATEGORIES,
    INITIAL_PRODUCTS,
    INITIAL_INVENTORY,
} from '../seed-data';

class DatabaseStore {
    private profiles: Profile[] = [...INITIAL_PROFILES];
    private companies: Company[] = [...INITIAL_COMPANIES];
    private stores: Store[] = [...INITIAL_STORES];
    private categories: Category[] = [...INITIAL_CATEGORIES];
    private products: Product[] = [...INITIAL_PRODUCTS];
    private inventory: StoreInventory[] = [...INITIAL_INVENTORY];
    private cartItems: CartItem[] = [];
    private reservations: Reservation[] = [];
    private orders: Order[] = [];
    private payments: Payment[] = [];
    private shipments: Shipment[] = [];
    private conversations: Conversation[] = [];
    private messages: Message[] = [];
    private notifications: Notification[] = [];

    // Lock primitive for high concurrency testing
    private locks: Map<string, boolean> = new Map();

    constructor() {
        this.seedMockOrdersAndChats();
    }

    private seedMockOrdersAndChats() {
        // Initial mock order
        const mockOrder: Order = {
            id: 'ord-1001',
            customer_id: 'usr-customer-1',
            store_id: 'store-tz-tirunelveli',
            order_number: 'ORD-SALESTORM-1001',
            subtotal: 79999,
            delivery_charge: 0,
            shipping_charge: 0,
            total_amount: 79999,
            payment_method: 'COD',
            fulfilment_type: 'PICKUP',
            status: 'READY_FOR_PICKUP',
            pickup_code: 'ST-9482',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date().toISOString(),
            items: [
                {
                    id: 'orditem-1',
                    order_id: 'ord-1001',
                    product_id: 'prod-iphone17',
                    quantity: 1,
                    unit_price: 79999,
                    subtotal: 79999,
                    product: this.products.find((p) => p.id === 'prod-iphone17'),
                },
            ],
            store: this.stores.find((s) => s.id === 'store-tz-tirunelveli'),
            customer_name: 'Dharshan Customer',
        };
        this.orders.push(mockOrder);

        // Initial mock chat conversation
        const mockConv: Conversation = {
            id: 'conv-1001',
            customer_id: 'usr-customer-1',
            company_id: 'comp-techzone',
            store_id: 'store-tz-tirunelveli',
            product_id: 'prod-iphone17',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            updated_at: new Date().toISOString(),
            customer_name: 'Dharshan Customer',
            company_name: 'TechZone Electronics Ltd',
            store_name: 'TechZone Tirunelveli Flagship',
            last_message: 'Yes, your order is ready for pickup.',
        };
        this.conversations.push(mockConv);

        this.messages.push(
            {
                id: 'msg-1',
                conversation_id: 'conv-1001',
                sender_id: 'usr-customer-1',
                sender_name: 'Dharshan Customer',
                sender_role: 'CUSTOMER',
                message: 'Hi! Is the iPhone 17 Pro available for store pickup today?',
                created_at: new Date(Date.now() - 7200000).toISOString(),
            },
            {
                id: 'msg-2',
                conversation_id: 'conv-1001',
                sender_id: 'usr-business-1',
                sender_name: 'TechZone Store Manager',
                sender_role: 'BUSINESS',
                message: 'Hello! Yes, we have 4 units in stock at Tirunelveli branch. You can place your order online and pick it up immediately.',
                created_at: new Date(Date.now() - 3600000).toISOString(),
            }
        );

        // Initial notifications
        this.notifications.push(
            {
                id: 'notif-1',
                user_id: 'usr-customer-1',
                type: 'ORDER_READY',
                title: 'Order Ready for Pickup',
                message: 'Order #ORD-SALESTORM-1001 is ready for pickup at TechZone Tirunelveli! Code: ST-9482',
                read: false,
                created_at: new Date().toISOString(),
            },
            {
                id: 'notif-2',
                user_id: 'usr-business-1',
                type: 'NEW_ORDER',
                title: 'New Store Pickup Order',
                message: 'Received new order #ORD-SALESTORM-1001 for 1x iPhone 17 Pro at Tirunelveli.',
                read: false,
                created_at: new Date().toISOString(),
            }
        );
    }

    // --- Profiles ---
    getProfiles() { return this.profiles; }
    getProfileById(id: string) { return this.profiles.find((p) => p.id === id || p.auth_user_id === id); }
    getProfileByEmail(email: string) { return this.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase()); }

    // --- Stores & Companies ---
    getCompanies() { return this.companies; }
    getStores() { return this.stores; }
    getStoreById(id: string) { return this.stores.find((s) => s.id === id); }
    getStoresByCompany(companyId: string) { return this.stores.filter((s) => s.company_id === companyId); }

    createStore(store: Omit<Store, 'id' | 'created_at' | 'updated_at'>): Store {
        const newStore: Store = {
            ...store,
            id: `store-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        this.stores.push(newStore);
        return newStore;
    }

    // --- Products & Categories ---
    getCategories() { return this.categories; }
    getProducts() { return this.products; }
    getProductById(id: string) { return this.products.find((p) => p.id === id); }

    createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
        const newProduct: Product = {
            ...product,
            id: `prod-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        this.products.push(newProduct);
        return newProduct;
    }

    // --- Inventory & Concurrency Engine ---
    getInventory() { return this.inventory; }

    getStoreInventory(storeId: string, productId: string): StoreInventory | undefined {
        return this.inventory.find((inv) => inv.store_id === storeId && inv.product_id === productId);
    }

    getStoreInventoryList(storeId: string): (StoreInventory & { product?: Product })[] {
        return this.inventory
            .filter((inv) => inv.store_id === storeId)
            .map((inv) => ({
                ...inv,
                product: this.products.find((p) => p.id === inv.product_id),
            }));
    }

    getProductStores(productId: string): (StoreInventory & { store?: Store })[] {
        return this.inventory
            .filter((inv) => inv.product_id === productId && inv.available_quantity > 0)
            .map((inv) => ({
                ...inv,
                store: this.stores.find((s) => s.id === inv.store_id),
            }));
    }

    updateInventoryStock(storeId: string, productId: string, available: number): StoreInventory {
        let inv = this.getStoreInventory(storeId, productId);
        if (!inv) {
            inv = {
                id: `inv-${Date.now()}`,
                store_id: storeId,
                product_id: productId,
                available_quantity: available,
                reserved_quantity: 0,
                sold_quantity: 0,
                version: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            this.inventory.push(inv);
        } else {
            inv.available_quantity = Math.max(0, available);
            inv.version += 1;
            inv.updated_at = new Date().toISOString();
        }
        return inv;
    }

    // Atomic Optimistic Reservation Logic (Core Requirement)
    reserveStockAtomic(
        storeId: string,
        productId: string,
        quantity: number,
        customerId: string,
        idempotencyKey: string,
        expiryMinutes: number = 10
    ): { success: boolean; reservation_id?: string; error?: string; message?: string; idempotency?: boolean } {
        // 1. Idempotency check
        const existingRes = this.reservations.find((r) => r.idempotency_key === idempotencyKey);
        if (existingRes) {
            return {
                success: true,
                reservation_id: existingRes.id,
                idempotency: true,
            };
        }

        // Mutex lock for atomic safety in memory
        const lockKey = `${storeId}:${productId}`;
        while (this.locks.get(lockKey)) {
            // spinning lock for microsecond synchronization
        }
        this.locks.set(lockKey, true);

        try {
            const inv = this.getStoreInventory(storeId, productId);
            if (!inv) {
                return { success: false, error: 'INVENTORY_NOT_FOUND', message: 'Product inventory record not found for this store' };
            }

            if (inv.available_quantity < quantity) {
                return { success: false, error: 'OUT_OF_STOCK', message: 'Insufficient inventory available' };
            }

            // Optimistic mutation
            inv.available_quantity -= quantity;
            inv.reserved_quantity += quantity;
            inv.version += 1;
            inv.updated_at = new Date().toISOString();

            const newReservation: Reservation = {
                id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                customer_id: customerId,
                store_id: storeId,
                product_id: productId,
                quantity,
                status: 'PENDING',
                idempotency_key: idempotencyKey,
                expires_at: new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            this.reservations.push(newReservation);

            return {
                success: true,
                reservation_id: newReservation.id,
            };
        } finally {
            this.locks.delete(lockKey);
        }
    }

    releaseReservation(reservationId: string): { success: boolean; message?: string } {
        const res = this.reservations.find((r) => r.id === reservationId);
        if (!res || res.status !== 'PENDING') {
            return { success: false, message: 'Reservation not found or already completed/released' };
        }

        const inv = this.getStoreInventory(res.store_id, res.product_id);
        if (inv) {
            inv.available_quantity += res.quantity;
            inv.reserved_quantity = Math.max(0, inv.reserved_quantity - res.quantity);
            inv.version += 1;
            inv.updated_at = new Date().toISOString();
        }

        res.status = 'RELEASED';
        res.updated_at = new Date().toISOString();
        return { success: true };
    }

    // --- Cart ---
    getCart(customerId: string): CartItem[] {
        return this.cartItems
            .filter((item) => item.cart_id === `cart-${customerId}`)
            .map((item) => ({
                ...item,
                product: this.products.find((p) => p.id === item.product_id),
                store: this.stores.find((s) => s.id === item.store_id),
            }));
    }

    addToCart(customerId: string, productId: string, storeId: string, quantity: number): CartItem {
        const cartId = `cart-${customerId}`;
        const product = this.getProductById(productId);
        if (!product) throw new Error('Product not found');

        let existing = this.cartItems.find(
            (item) => item.cart_id === cartId && item.product_id === productId && item.store_id === storeId
        );

        if (existing) {
            existing.quantity += quantity;
            return existing;
        }

        const newItem: CartItem = {
            id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            cart_id: cartId,
            product_id: productId,
            store_id: storeId,
            quantity,
            price_snapshot: product.price,
            created_at: new Date().toISOString(),
        };
        this.cartItems.push(newItem);
        return newItem;
    }

    removeFromCart(itemId: string) {
        this.cartItems = this.cartItems.filter((i) => i.id !== itemId);
    }

    clearCart(customerId: string) {
        this.cartItems = this.cartItems.filter((i) => i.cart_id !== `cart-${customerId}`);
    }

    // --- Orders ---
    getOrders(customerId?: string): Order[] {
        let list = this.orders;
        if (customerId) {
            list = list.filter((o) => o.customer_id === customerId);
        }
        return list.map((o) => ({
            ...o,
            items: o.items || [],
            store: this.stores.find((s) => s.id === o.store_id),
        }));
    }

    getOrdersByStore(storeId: string): Order[] {
        return this.orders
            .filter((o) => o.store_id === storeId)
            .map((o) => ({
                ...o,
                items: o.items || [],
                store: this.stores.find((s) => s.id === o.store_id),
            }));
    }

    getOrderById(orderId: string): Order | undefined {
        const o = this.orders.find((ord) => ord.id === orderId || ord.order_number === orderId);
        if (!o) return undefined;
        return {
            ...o,
            items: o.items || [],
            store: this.stores.find((s) => s.id === o.store_id),
        };
    }

    createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Order {
        const orderNumber = `ORD-SALESTORM-${Math.floor(1000 + Math.random() * 9000)}`;
        const pickupCode = orderData.fulfilment_type === 'PICKUP' ? `ST-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

        const newOrder: Order = {
            ...orderData,
            id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            order_number: orderNumber,
            pickup_code: pickupCode,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Update inventory from reserved to sold
        if (newOrder.items) {
            for (const item of newOrder.items) {
                const inv = this.getStoreInventory(newOrder.store_id, item.product_id);
                if (inv) {
                    inv.reserved_quantity = Math.max(0, inv.reserved_quantity - item.quantity);
                    inv.sold_quantity += item.quantity;
                    inv.version += 1;
                    inv.updated_at = new Date().toISOString();
                }
            }
        }

        this.orders.unshift(newOrder);

        // Create notification
        this.notifications.unshift({
            id: `notif-${Date.now()}`,
            user_id: newOrder.customer_id,
            type: 'ORDER_CREATED',
            title: 'Order Placed Successfully!',
            message: `Your order ${orderNumber} has been placed. Fulfilment: ${newOrder.fulfilment_type}`,
            read: false,
            created_at: new Date().toISOString(),
        });

        return newOrder;
    }

    updateOrderStatus(orderId: string, status: Order['status'], reason?: string): Order {
        const order = this.getOrderById(orderId);
        if (!order) throw new Error('Order not found');

        order.status = status;
        order.updated_at = new Date().toISOString();

        if (status === 'CANCELLED' || status === 'AUTO_CANCELLED') {
            order.cancellation_reason = reason || 'Cancelled by system/user';
            order.cancelled_at = new Date().toISOString();

            // Return stock if cancelled
            if (order.items) {
                for (const item of order.items) {
                    const inv = this.getStoreInventory(order.store_id, item.product_id);
                    if (inv) {
                        inv.available_quantity += item.quantity;
                        inv.sold_quantity = Math.max(0, inv.sold_quantity - item.quantity);
                        inv.version += 1;
                        inv.updated_at = new Date().toISOString();
                    }
                }
            }
        }

        return order;
    }

    // --- Conversations & Chat ---
    getConversations(userId: string): Conversation[] {
        return this.conversations.filter((c) => c.customer_id === userId || c.company_id === userId);
    }

    getMessages(conversationId: string): Message[] {
        return this.messages.filter((m) => m.conversation_id === conversationId);
    }

    sendMessage(conversationId: string, senderId: string, senderRole: Profile['role'], text: string): Message {
        const conv = this.conversations.find((c) => c.id === conversationId);
        const profile = this.getProfileById(senderId);

        const msg: Message = {
            id: `msg-${Date.now()}`,
            conversation_id: conversationId,
            sender_id: senderId,
            sender_name: profile?.full_name || 'User',
            sender_role: senderRole,
            message: text,
            created_at: new Date().toISOString(),
        };
        this.messages.push(msg);

        if (conv) {
            conv.last_message = text;
            conv.updated_at = new Date().toISOString();
        }
        return msg;
    }

    startConversation(customerId: string, companyId: string, storeId?: string, productId?: string): Conversation {
        let existing = this.conversations.find(
            (c) => c.customer_id === customerId && c.company_id === companyId && c.product_id === productId
        );
        if (existing) return existing;

        const company = this.companies.find((c) => c.id === companyId);
        const store = storeId ? this.stores.find((s) => s.id === storeId) : undefined;
        const customer = this.getProfileById(customerId);

        const conv: Conversation = {
            id: `conv-${Date.now()}`,
            customer_id: customerId,
            company_id: companyId,
            store_id: storeId,
            product_id: productId,
            customer_name: customer?.full_name || 'Customer',
            company_name: company?.name || 'Store',
            store_name: store?.name,
            last_message: 'Started conversation',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        this.conversations.push(conv);
        return conv;
    }

    // --- Notifications ---
    getNotifications(userId: string): Notification[] {
        return this.notifications.filter((n) => n.user_id === userId);
    }

    markNotificationRead(id: string) {
        const n = this.notifications.find((notif) => notif.id === id);
        if (n) n.read = true;
    }

    // --- Automatic Expiry & Cancellation Scheduler ---
    runAutoCancellationEngine(): { expiredReservations: number; autoCancelledOrders: number } {
        const now = new Date();
        let expiredReservations = 0;
        let autoCancelledOrders = 0;

        // 1. Expire stale pending reservations
        for (const res of this.reservations) {
            if (res.status === 'PENDING' && new Date(res.expires_at) < now) {
                this.releaseReservation(res.id);
                res.status = 'EXPIRED';
                expiredReservations++;
            }
        }

        // 2. Auto-cancel READY_FOR_PICKUP COD orders past 24 hours
        for (const order of this.orders) {
            if (order.status === 'READY_FOR_PICKUP' && order.payment_method === 'COD') {
                const orderTime = new Date(order.updated_at || order.created_at);
                const hoursPassed = (now.getTime() - orderTime.getTime()) / (1000 * 3600);
                if (hoursPassed >= 24) {
                    this.updateOrderStatus(order.id, 'AUTO_CANCELLED', 'Pickup deadline expired (24 hours elapsed)');
                    autoCancelledOrders++;
                }
            }
        }

        return { expiredReservations, autoCancelledOrders };
    }
}

// Global Singleton Instance
export const db = new DatabaseStore();
