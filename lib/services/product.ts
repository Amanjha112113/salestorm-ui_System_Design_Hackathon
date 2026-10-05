import { Product, Category } from '@/lib/types';
import { db } from '@/lib/db/store';

export class ProductService {
    private static instance: ProductService;

    private constructor() { }

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    public async getProducts(categoryId?: string, brand?: string): Promise<Product[]> {
        let products = db.getProducts();
        if (categoryId) products = products.filter((p) => p.category_id === categoryId);
        if (brand) products = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
        return products;
    }

    public async getProductById(productId: string): Promise<Product | null> {
        return db.getProductById(productId) || null;
    }

    public async getCategories(): Promise<Category[]> {
        return db.getCategories();
    }

    public async createProduct(data: Partial<Product>): Promise<Product> {
        return db.createProduct({
            category_id: data.category_id || 'cat-smartphones',
            brand: data.brand || 'Generic',
            model: data.model || 'Model-X',
            name: data.name || 'Electronics Item',
            description: data.description || 'High quality electronics product.',
            sku: data.sku || `SKU-${Date.now()}`,
            price: data.price || 9999,
            images: data.images || ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop'],
            specifications: data.specifications || {},
            warranty: data.warranty || '1 Year Brand Warranty',
            status: 'ACTIVE',
        });
    }
}

export const productService = ProductService.getInstance();
