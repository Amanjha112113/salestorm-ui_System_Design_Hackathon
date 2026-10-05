'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Store as StoreIcon, MapPin, Phone, Clock, ShoppingCart, MessageSquare } from 'lucide-react';
import { Store, StoreInventory, Product } from '@/lib/types';
import { StockBadge } from '@/components/stock-badge';

export default function StoreDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [store, setStore] = useState<Store | null>(null);
    const [inventoryList, setInventoryList] = useState<(StoreInventory & { product?: Product })[]>([]);
    const [addingId, setAddingId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch store products
        fetch(`/api/products?storeId=${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    const invs = data.data.map((prod: Product) => ({
                        id: `inv-${prod.id}`,
                        store_id: params.id,
                        product_id: prod.id,
                        available_quantity: Math.floor(Math.random() * 15) + 2,
                        reserved_quantity: 0,
                        sold_quantity: 5,
                        version: 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        product: prod,
                    }));
                    setInventoryList(invs);
                }
            });

        fetch(`/api/stores`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    const s = data.data.find((st: Store) => st.id === params.id);
                    if (s) setStore(s);
                }
            });
    }, [params.id]);

    const handleAddToCart = async (productId: string) => {
        setAddingId(productId);
        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: 'usr-customer-1',
                    productId,
                    storeId: params.id,
                    quantity: 1,
                }),
            });
            alert('Product added to cart!');
        } catch {
            alert('Failed to add to cart');
        } finally {
            setAddingId(null);
        }
    };

    const handleStartChat = async () => {
        if (!store) return;
        try {
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: 'usr-customer-1',
                    companyId: store.company_id,
                    storeId: store.id,
                    message: `Hi ${store.name}! I have a question regarding store stock.`,
                }),
            });
            const data = await res.json();
            if (data.success) router.push('/chat');
        } catch {
            router.push('/chat');
        }
    };

    if (!store) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
                Loading Store Details...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Store Header Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                            {store.company_name}
                        </span>
                        <h1 className="text-3xl font-black text-slate-900">{store.name}</h1>
                        <p className="text-slate-500 text-sm flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-indigo-600" />
                            {store.address}, {store.city}, {store.state} - {store.pincode}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleStartChat}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm px-5 py-3 rounded-2xl transition flex items-center gap-2 border border-indigo-200"
                        >
                            <MessageSquare className="h-4 w-4" /> Chat with Store
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 font-medium">
                    <div>
                        <span className="text-xs text-slate-400 block font-semibold">STATUS</span>
                        <span className="text-emerald-700 font-bold">🟢 {store.status}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block font-semibold">STORE HOURS</span>
                        <span>{store.opening_time} - {store.closing_time}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block font-semibold">PHONE</span>
                        <span>{store.phone}</span>
                    </div>
                    <div>
                        <span className="text-xs text-slate-400 block font-semibold">FULFILMENT</span>
                        <span className="text-slate-900 font-bold">Pickup, Local Delivery, Shipping</span>
                    </div>
                </div>
            </div>

            {/* Available Inventory Section */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Products Available at this Store</h2>
                    <p className="text-sm text-slate-500">Live store stock reserved directly from this branch</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inventoryList.map((inv) => {
                        const prod = inv.product;
                        if (!prod) return null;
                        return (
                            <div key={inv.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
                                <div>
                                    <div className="h-48 bg-slate-50 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center p-4">
                                        <img src={prod.images[0]} alt={prod.name} className="max-h-full max-w-full object-contain" />
                                        <div className="absolute top-3 left-3">
                                            <StockBadge available={inv.available_quantity} />
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-400 font-bold uppercase">{prod.brand}</div>
                                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{prod.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{prod.description}</p>
                                </div>

                                <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                                    <div className="flex items-baseline justify-between">
                                        <span className="text-xl font-black text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                                        <span className="text-xs text-slate-500">Store Stock: <strong>{inv.available_quantity}</strong></span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleAddToCart(prod.id)}
                                            disabled={addingId === prod.id}
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1"
                                        >
                                            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                                        </button>
                                        <Link
                                            href={`/products/${prod.id}`}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold text-xs py-3 rounded-xl transition"
                                        >
                                            BUY NOW
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
