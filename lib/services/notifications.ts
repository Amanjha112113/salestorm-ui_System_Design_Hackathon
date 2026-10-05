import { Notification } from '@/lib/types';
import { db } from '@/lib/db/store';

export class NotificationService {
    private static instance: NotificationService;

    private constructor() { }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public async getNotifications(userId: string): Promise<Notification[]> {
        return db.getNotifications(userId);
    }

    public async sendNotification(userId: string, title: string, message: string, type: string = 'ORDER'): Promise<Notification> {
        const notif: Notification = {
            id: `ntf-${Date.now()}`,
            user_id: userId,
            type,
            title,
            message,
            read: false,
            created_at: new Date().toISOString(),
        };
        db.getNotifications(userId).push(notif);
        return notif;
    }
}

export const notificationService = NotificationService.getInstance();
