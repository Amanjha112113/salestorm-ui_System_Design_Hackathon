import { Product, Store } from '@/lib/types';
import { db } from '@/lib/db/store';
import { calculateHaversineDistance } from '@/lib/services/location';

export class SearchService {
    private static instance: SearchService;

    private constructor() { }

    public static getInstance(): SearchService {
        if (!SearchService.instance) {
            SearchService.instance = new SearchService();
        }
        return SearchService.instance;
    }

    public async searchProductsAndStores(query: string, userLat?: number, userLng?: number) {
        const q = query.toLowerCase();
        const products = db.getProducts().filter(
            (p) =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q)
        );

        return products.map((product) => {
            const storeInventories = db.getProductStores(product.id);
            const totalStock = storeInventories.reduce((sum, inv) => sum + inv.available_quantity, 0);

            return {
                ...product,
                total_stock: totalStock,
                stores: storeInventories.map((inv) => ({
                    store: inv.store,
                    available_quantity: inv.available_quantity,
                    distance_km: inv.store
                        ? calculateHaversineDistance(
                            userLat || 8.7139,
                            userLng || 77.7567,
                            inv.store.latitude,
                            inv.store.longitude
                        )
                        : 0,
                })),
            };
        });
    }
}

export const searchService = SearchService.getInstance();
