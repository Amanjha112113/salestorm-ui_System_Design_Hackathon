'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    CheckCircle2,
    Clock,
    MapPin,
    Store,
    XCircle,
    AlertTriangle,
    MessageSquare,
    QrCode,
    ShieldAlert,
} from 'lucide-react';
import { Order } from '@/lib/types';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [issueText, setIssueText] = useState('');

    useEffect(() => {
        fetch(`/api/orders?customerId=usr-customer-1`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    const found = data.data.find((o: Order) => o.id === params.id);
                    if (found) setOrder(found);
                }
                setLoading(false);
            });
    }, [params.id]);

    const handleCancelOrder = async () => {
        if (!order) return;
        if (!confirm('Are you sure you want to cancel this order? Item stock will be immediately released.')) return;

        try {
            const res = await fetch(`/api/orders/${order.id}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 'usr-customer-1', reason: 'Customer requested cancellation' }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Order cancelled successfully. Stock released!');
                setOrder(data.data);
            } else {
                alert(`Cancellation error: ${data.error?.message}`);
            }
        } catch {
            alert('Failed to cancel order');
        }
    };

    const handleReportIssue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!issueText) return;
        alert(`Issue submitted for Order ${order?.id}. Store team will reach out via chat.`);
        setIssueModalOpen(false);
        setIssueText('');
    };

    if (loading || !order) {
        return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Loading Order Details...</div>;
    }

    const isCancelled = order.status === 'CANCELLED';

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <span className="text-xs font-mono text-slate-400 font-bold uppercase">ORDER #{order.id}</span>
                        <h1 className="text-2xl font-black text-slate-900 mt-1">{order.store_name || order.store?.name || 'Electronics Store'}</h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${isCancelled ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                            {order.status}
                        </span>
                        <button
                            onClick={() => router.push('/chat')}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 border border-indigo-200"
                        >
                            <MessageSquare className="h-4 w-4" /> Store Chat
                        </button>
                    </div>
                </div>

                {/* Pickup Verification Code Section */}
                {order.pickup_code && !isCancelled && (
                    <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-lg">
                        <div className="space-y-1">
                            <span className="text-xs font-mono uppercase tracking-widest text-indigo-300">Store Pickup Verification Code</span>
                            <div className="text-3xl font-black font-mono tracking-wider text-emerald-400">{order.pickup_code}</div>
                            <p className="text-xs text-slate-300">Show this code at store counter for instant verification & handover</p>
                        </div>
                        <div className="bg-white p-2 rounded-xl text-slate-900 hidden sm:block">
                            <QrCode className="h-12 w-12" />
                        </div>
                    </div>
                )}

                {/* Status Timeline */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Fulfilment Progress</h3>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className={`p-3 rounded-xl border ${order.status !== 'CANCELLED' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400'}`}>
                            1. Placed
                        </div>
                        <div className={`p-3 rounded-xl border ${['RESERVED', 'CONFIRMED', 'READY_FOR_PICKUP', 'DELIVERED', 'COMPLETED'].includes(order.status) ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400'}`}>
                            2. Stock Reserved
                        </div>
                        <div className={`p-3 rounded-xl border ${['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED'].includes(order.status) ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-100 text-slate-400'}`}>
                            3. Ready
                        </div>
                        <div className={`p-3 rounded-xl border ${['COMPLETED', 'DELIVERED'].includes(order.status) ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : isCancelled ? 'bg-red-50 border-red-200 text-red-700 font-bold' : 'bg-slate-100 text-slate-400'}`}>
                            4. {isCancelled ? 'Cancelled' : 'Fulfilled'}
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Ordered Products</h3>
                    <div className="divide-y divide-slate-100">
                        {(order.items || []).map((item, idx) => (
                            <div key={idx} className="py-3 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{item.product_name || item.product?.name || 'Electronics Item'}</h4>
                                    <span className="text-xs text-slate-500">Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}</span>
                                </div>
                                <span className="font-black text-slate-900 text-sm">₹{(item.total_price || (item.quantity * item.unit_price)).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <button
                        onClick={() => setIssueModalOpen(true)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200"
                    >
                        <AlertTriangle className="h-4 w-4" /> Report an Issue (Defect / Wrong Item)
                    </button>

                    {!isCancelled && ['RESERVED', 'CONFIRMED', 'PENDING'].includes(order.status) && (
                        <button
                            onClick={handleCancelOrder}
                            className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-red-200 transition flex items-center gap-1"
                        >
                            <XCircle className="h-4 w-4" /> Cancel Order & Release Stock
                        </button>
                    )}
                </div>
            </div>

            {/* Report Issue Modal */}
            {issueModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 space-y-4 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-amber-600" /> Report Order Issue
                        </h3>
                        <p className="text-xs text-slate-500 leading-normal">
                            SALESTORM policy allows issue reporting for defective items or wrong products delivered. Describe the issue below:
                        </p>
                        <form onSubmit={handleReportIssue} className="space-y-4">
                            <textarea
                                rows={3}
                                required
                                placeholder="Describe issue (e.g. wrong model delivered, damaged seal)..."
                                value={issueText}
                                onChange={(e) => setIssueText(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            ></textarea>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIssueModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                                >
                                    Submit Issue Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
