import { CartItem } from '@/lib/types';
import { db } from '@/lib/db/store';

export class CartService {
    private static instance: CartService;

    private constructor() { }

    public static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }

    public async getCartItems(customerId: string = 'usr-customer-1'): Promise<CartItem[]> {
        return db.getCart(customerId);
    }

    public async addToCart(storeId: string, productId: string, quantity: number, customerId: string = 'usr-customer-1'): Promise<CartItem> {
        return db.addToCart(customerId, productId, storeId, quantity);
    }

    public async clearCart(customerId: string = 'usr-customer-1'): Promise<void> {
        db.clearCart(customerId);
    }

    public async groupCartByStore(customerId: string = 'usr-customer-1'): Promise<Record<string, CartItem[]>> {
        const items = await this.getCartItems(customerId);
        const grouped: Record<string, CartItem[]> = {};

        for (const item of items) {
            if (!grouped[item.store_id]) {
                grouped[item.store_id] = [];
            }
            grouped[item.store_id].push(item);
        }
        return grouped;
    }
}

export const cartService = CartService.getInstance();
