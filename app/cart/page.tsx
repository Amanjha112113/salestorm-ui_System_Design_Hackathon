'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, ArrowRight, Store as StoreIcon, ShieldAlert } from 'lucide-react';
import { CartItem } from '@/lib/types';

export default function CartPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart?customerId=usr-customer-1');
            const data = await res.json();
            if (data.success) setCartItems(data.data);
        } catch {
            // Ignore
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
        fetchCart();
    };

    const handleClearCart = async () => {
        await fetch(`/api/cart?customerId=usr-customer-1`, { method: 'DELETE' });
        fetchCart();
    };

    // Group items by storeId
    const storeGroups = cartItems.reduce((acc, item) => {
        const sId = item.store_id;
        if (!acc[sId]) acc[sId] = [];
        acc[sId].push(item);
        return acc;
    }, {} as Record<string, CartItem[]>);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price_snapshot * item.quantity, 0);

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Loading Shopping Cart...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
                    <p className="text-slate-500">Products grouped by physical retail store</p>
                </div>
                {cartItems.length > 0 && (
                    <button onClick={handleClearCart} className="text-xs text-red-600 font-bold hover:underline">
                        Clear Cart
                    </button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
                    <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-900">Your shopping cart is empty</h3>
                    <p className="text-sm text-slate-500">Explore electronics near you and reserve items for express pickup</p>
                    <Link
                        href="/buy"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-2xl transition"
                    >
                        BROWSE ELECTRONICS
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Cart Items split by store */}
                    <div className="lg:col-span-8 space-y-6">
                        {Object.entries(storeGroups).map(([storeId, items]) => {
                            const storeName = items[0]?.store?.name || 'Local Store';
                            const groupTotal = items.reduce((sum, i) => sum + i.price_snapshot * i.quantity, 0);

                            return (
                                <div key={storeId} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                        <div className="flex items-center gap-2">
                                            <StoreIcon className="h-5 w-5 text-indigo-600" />
                                            <h3 className="font-bold text-slate-900 text-base">{storeName}</h3>
                                        </div>
                                        <span className="text-xs font-mono text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-md">
                                            Store Order Group
                                        </span>
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                        {items.map((item) => (
                                            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={item.product?.images?.[0]}
                                                        alt={item.product?.name}
                                                        className="h-16 w-16 object-contain bg-slate-50 rounded-xl p-2"
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm">{item.product?.name}</h4>
                                                        <p className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.price_snapshot.toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="font-black text-slate-900 text-base">
                                                        ₹{(item.price_snapshot * item.quantity).toLocaleString('en-IN')}
                                                    </span>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2 text-right text-xs text-slate-500 font-medium">
                                        Store Group Subtotal: <strong className="text-slate-900 font-black">₹{groupTotal.toLocaleString('en-IN')}</strong>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cart Summary & Policy Box */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                            <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Estimated Delivery / Pickup</span>
                                    <span className="text-emerald-700 font-bold">Calculated at Checkout</span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 flex justify-between text-base font-black text-slate-900">
                                    <span>Total Amount</span>
                                    <span className="text-indigo-600">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Mandatory Policy Disclosure Notice */}
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 space-y-1 text-xs text-amber-900">
                                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                                    <ShieldAlert className="h-4 w-4 text-amber-700" /> Policy Notice
                                </div>
                                <p className="leading-relaxed">
                                    SALESTORM does not offer returns or replacements for change-of-mind purchases.
                                </p>
                            </div>

                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                            >
                                PROCEED TO CHECKOUT <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
