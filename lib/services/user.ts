import { Profile } from '@/lib/types';
import { db } from '@/lib/db/store';

export class UserService {
    private static instance: UserService;

    private constructor() { }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async getProfile(userId: string): Promise<Profile | null> {
        return db.getProfileById(userId) || null;
    }

    public async updatePreferences(userId: string, prefs: { defaultCity?: string; defaultPincode?: string }): Promise<Profile | null> {
        const profile = db.getProfileById(userId);
        if (!profile) return null;
        return profile;
    }
}

export const userService = UserService.getInstance();
