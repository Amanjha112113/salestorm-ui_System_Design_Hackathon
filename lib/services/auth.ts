import { UserRole } from '@/lib/types';
import { db } from '@/lib/db/store';

export class AuthService {
    private static instance: AuthService;

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async getUserRole(userId: string): Promise<UserRole> {
        const profile = db.getProfileById(userId);
        return profile ? profile.role : 'CUSTOMER';
    }

    public async validateUserRole(userId: string, allowedRoles: UserRole[]): Promise<boolean> {
        const role = await this.getUserRole(userId);
        return allowedRoles.includes(role);
    }

    public async verifySessionToken(token: string): Promise<{ valid: boolean; userId?: string; role?: UserRole }> {
        if (!token) return { valid: false };
        return { valid: true, userId: 'usr-customer-1', role: 'CUSTOMER' };
    }
}

export const authService = AuthService.getInstance();
