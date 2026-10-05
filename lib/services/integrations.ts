export class ExternalIntegrationsAdapter {
    private static instance: ExternalIntegrationsAdapter;

    private constructor() { }

    public static getInstance(): ExternalIntegrationsAdapter {
        if (!ExternalIntegrationsAdapter.instance) {
            ExternalIntegrationsAdapter.instance = new ExternalIntegrationsAdapter();
        }
        return ExternalIntegrationsAdapter.instance;
    }

    // 1. Maps / Location Service (Google Maps / OpenStreetMap mock)
    public async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
        return { lat: 8.7139, lng: 77.7567 };
    }

    // 2. Shipping & Courier Partner Service (Mock)
    public async createShipment(orderId: string, address: string): Promise<{ trackingNumber: string; carrier: string }> {
        const trackingNumber = `TRK-${Date.now()}`;
        return { trackingNumber, carrier: 'BlueDart Express (Mock)' };
    }

    // 3. Email & SMS Service (Mock)
    public async sendSMS(phone: string, text: string): Promise<{ success: boolean; messageId: string }> {
        return { success: true, messageId: `msg-${Date.now()}` };
    }
}

export const externalIntegrations = ExternalIntegrationsAdapter.getInstance();
