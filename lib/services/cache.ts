export class RedisCacheAdapter {
    private static instance: RedisCacheAdapter;
    private cache: Map<string, { value: any; expiresAt: number }> = new Map();

    private constructor() { }

    public static getInstance(): RedisCacheAdapter {
        if (!RedisCacheAdapter.instance) {
            RedisCacheAdapter.instance = new RedisCacheAdapter();
        }
        return RedisCacheAdapter.instance;
    }

    public async get<T>(key: string): Promise<T | null> {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return item.value as T;
    }

    public async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    public async checkRateLimit(clientIp: string, maxRequests: number = 100, windowSeconds: number = 60): Promise<boolean> {
        const key = `ratelimit:${clientIp}`;
        const count = (await this.get<number>(key)) || 0;
        if (count >= maxRequests) return false;
        await this.set(key, count + 1, windowSeconds);
        return true;
    }
}

export const redisCache = RedisCacheAdapter.getInstance();
