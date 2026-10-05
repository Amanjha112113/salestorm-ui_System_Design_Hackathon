'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Clock, Store, MapPin } from 'lucide-react';
import { Order } from '@/lib/types';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders?customerId=usr-customer-1')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setOrders(data.data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Orders</h1>
                <p className="text-slate-500">Track store pickup codes, delivery status, and order timeline</p>
            </div>

            {loading ? (
                <div className="py-16 text-center text-slate-500">Loading Orders...</div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                    <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto" />
                    <h3 className="text-xl font-bold text-slate-900">No orders placed yet</h3>
                    <p className="text-sm text-slate-500">Discover nearby electronics and place your first store order</p>
                    <Link
                        href="/buy"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-2xl transition"
                    >
                        BUY ELECTRONICS
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">ORDER ID: {order.id}</span>
                                    <h3 className="font-bold text-slate-900 text-lg">{order.store_name || order.store?.name || 'Electronics Store'}</h3>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                        {order.status}
                                    </span>
                                    <span className="text-sm font-black text-slate-900">
                                        ₹{order.total_amount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1 text-xs text-slate-500">
                                    <p className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" /> Placed: {new Date(order.created_at).toLocaleString()}
                                    </p>
                                    <p className="flex items-center gap-1.5 font-bold text-slate-700">
                                        <Store className="h-3.5 w-3.5 text-indigo-600" /> Fulfilment: {order.fulfilment_type} ({order.payment_method})
                                    </p>
                                    {order.pickup_code && order.status !== 'CANCELLED' && (
                                        <p className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md inline-block">
                                            Store Pickup Code: {order.pickup_code}
                                        </p>
                                    )}
                                </div>

                                <Link
                                    href={`/orders/${order.id}`}
                                    className="bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1"
                                >
                                    View Details & Timeline <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
