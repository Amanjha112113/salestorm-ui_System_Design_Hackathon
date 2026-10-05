import { Conversation, Message } from '@/lib/types';
import { db } from '@/lib/db/store';

export class ChatService {
    private static instance: ChatService;

    private constructor() { }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public async getConversations(userId: string): Promise<Conversation[]> {
        return db.getConversations(userId);
    }

    public async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
        const profile = db.getProfileById(senderId);
        const role = profile ? profile.role : 'CUSTOMER';
        return db.sendMessage(conversationId, senderId, role, text);
    }
}

export const chatService = ChatService.getInstance();
