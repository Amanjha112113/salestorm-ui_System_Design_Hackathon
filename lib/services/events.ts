export type EventType =
    | 'ORDER_CREATED'
    | 'PAYMENT_SUCCESS'
    | 'STOCK_RESERVED'
    | 'NOTIFICATION_SENT'
    | 'FULFILMENT_UPDATED';

export interface DomainEvent {
    id: string;
    type: EventType;
    payload: Record<string, any>;
    timestamp: string;
}

export class MessageQueueBus {
    private static instance: MessageQueueBus;
    private listeners: Map<EventType, Array<(event: DomainEvent) => void>> = new Map();

    private constructor() { }

    public static getInstance(): MessageQueueBus {
        if (!MessageQueueBus.instance) {
            MessageQueueBus.instance = new MessageQueueBus();
        }
        return MessageQueueBus.instance;
    }

    public subscribe(type: EventType, callback: (event: DomainEvent) => void) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)!.push(callback);
    }

    public async publish(type: EventType, payload: Record<string, any>): Promise<DomainEvent> {
        const event: DomainEvent = {
            id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            type,
            payload,
            timestamp: new Date().toISOString(),
        };

        const callbacks = this.listeners.get(type) || [];
        for (const cb of callbacks) {
            try {
                cb(event);
            } catch {
                // Log event dispatch failure
            }
        }
        return event;
    }
}

export const eventBus = MessageQueueBus.getInstance();
