export type UserRole = 'CUSTOMER' | 'BUSINESS' | 'ADMIN';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'RELEASED' | 'EXPIRED' | 'CANCELLED';

export type FulfilmentType = 'PICKUP' | 'LOCAL_DELIVERY' | 'SHIPPING';

export type PaymentMethod = 'ONLINE' | 'COD';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type OrderStatus =
    | 'CREATED'
    | 'PAYMENT_PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'READY_FOR_PICKUP'
    | 'PACKED'
    | 'SHIPPED'
    | 'IN_TRANSIT'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'PICKED_UP'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'AUTO_CANCELLED';

export interface Profile {
    id: string;
    auth_user_id?: string;
    full_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface Company {
    id: string;
    name: string;
    email: string;
    phone: string;
    description?: string;
    logo_url?: string;
    owner_id: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
}

export interface Store {
    id: string;
    company_id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    phone: string;
    opening_time: string;
    closing_time: string;
    status: 'OPEN' | 'CLOSED';
    created_at: string;
    updated_at: string;
    company_name?: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    created_at: string;
}

export interface Product {
    id: string;
    category_id: string;
    brand: string;
    model: string;
    name: string;
    description: string;
    sku: string;
    price: number;
    images: string[];
    specifications: Record<string, any>;
    warranty?: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
    updated_at: string;
    category_name?: string;
}

export interface StoreInventory {
    id: string;
    store_id: string;
    product_id: string;
    available_quantity: number;
    reserved_quantity: number;
    sold_quantity: number;
    version: number;
    created_at: string;
    updated_at: string;
    product?: Product;
    store?: Store;
}

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    store_id: string;
    quantity: number;
    price_snapshot: number;
    created_at: string;
    product?: Product;
    store?: Store;
}

export interface Reservation {
    id: string;
    customer_id: string;
    store_id: string;
    product_id: string;
    quantity: number;
    status: ReservationStatus;
    idempotency_key: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product_name?: string;
    total_price?: number;
    product?: Product;
}

export interface Order {
    id: string;
    customer_id: string;
    store_id: string;
    order_number: string;
    subtotal: number;
    delivery_charge: number;
    shipping_charge: number;
    total_amount: number;
    payment_method: PaymentMethod;
    fulfilment_type: FulfilmentType;
    status: OrderStatus;
    cancellation_reason?: string;
    cancelled_at?: string;
    pickup_code?: string;
    delivery_address?: string;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
    store?: Store;
    store_name?: string;
    customer_name?: string;
}

export interface Payment {
    id: string;
    order_id: string;
    transaction_reference: string;
    amount: number;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    idempotency_key: string;
    gateway_response?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface Shipment {
    id: string;
    order_id: string;
    carrier: string;
    tracking_number: string;
    status: string;
    estimated_delivery?: string;
    shipped_at?: string;
    delivered_at?: string;
    created_at: string;
}

export interface Conversation {
    id: string;
    customer_id: string;
    company_id: string;
    store_id?: string;
    product_id?: string;
    created_at: string;
    updated_at: string;
    customer_name?: string;
    company_name?: string;
    store_name?: string;
    last_message?: string;
    messages?: Message[];
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender_name?: string;
    sender_role?: UserRole;
    message: string;
    read_at?: string;
    created_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

export interface UserLocation {
    city: string;
    latitude: number;
    longitude: number;
    pincode?: string;
}
