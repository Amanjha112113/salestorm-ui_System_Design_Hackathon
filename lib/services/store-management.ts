import { Company, Store } from '@/lib/types';
import { db } from '@/lib/db/store';

export class StoreManagementService {
    private static instance: StoreManagementService;

    private constructor() { }

    public static getInstance(): StoreManagementService {
        if (!StoreManagementService.instance) {
            StoreManagementService.instance = new StoreManagementService();
        }
        return StoreManagementService.instance;
    }

    public async getCompanies(): Promise<Company[]> {
        return db.getCompanies();
    }

    public async getStores(companyId?: string): Promise<Store[]> {
        if (companyId) return db.getStoresByCompany(companyId);
        return db.getStores();
    }

    public async getStoreById(storeId: string): Promise<Store | null> {
        return db.getStoreById(storeId) || null;
    }

    public async registerCompany(data: Partial<Company>): Promise<Company> {
        const newCompany: Company = {
            id: `cmp-${Date.now()}`,
            name: data.name || 'New Company',
            email: data.email || 'company@salestorm.in',
            phone: data.phone || '+91 99999 99999',
            owner_id: data.owner_id || 'usr-business-1',
            status: 'ACTIVE',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        db.getCompanies().push(newCompany);
        return newCompany;
    }

    public async addStore(data: Partial<Store>): Promise<Store> {
        return db.createStore({
            company_id: data.company_id || 'cmp-techzone',
            name: data.name || 'New Electronics Branch',
            address: data.address || 'Central Road',
            city: data.city || 'Tirunelveli',
            state: data.state || 'Tamil Nadu',
            pincode: data.pincode || '627001',
            latitude: data.latitude || 8.7139,
            longitude: data.longitude || 77.7567,
            phone: data.phone || '+91 98765 00000',
            opening_time: '09:00',
            closing_time: '21:00',
            status: 'OPEN',
        });
    }
}

export const storeManagementService = StoreManagementService.getInstance();
