'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Store as StoreIcon,
    Truck,
    Package,
    CreditCard,
    Banknote,
    CheckCircle2,
    AlertTriangle,
    ShieldCheck,
    Lock,
} from 'lucide-react';
import { CartItem, FulfilmentType, PaymentMethod } from '@/lib/types';
import { DEFAULT_USER_LOCATION } from '@/lib/services/location';

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [fulfilmentType, setFulfilmentType] = useState<FulfilmentType>('PICKUP');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE');
    const [deliveryAddress, setDeliveryAddress] = useState('42 South Bypass Road, Palayamkottai, Tirunelveli 627005');
    const [policyAccepted, setPolicyAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/cart?customerId=usr-customer-1')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setCartItems(data.data);
            });
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price_snapshot * item.quantity, 0);

    // Delivery charge calculation
    let deliveryFee = 0;
    let shippingFee = 0;
    if (fulfilmentType === 'LOCAL_DELIVERY') deliveryFee = 49;
    else if (fulfilmentType === 'SHIPPING') shippingFee = 149;

    const grandTotal = subtotal + deliveryFee + shippingFee;

    const handlePlaceOrder = async () => {
        if (!policyAccepted) {
            alert('Please acknowledge SALESTORM’s cancellation and policy notice to proceed.');
            return;
        }

        setLoading(true);
        try {
            const checkoutRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: 'usr-customer-1',
                    items: cartItems.map((i) => ({
                        productId: i.product_id,
                        storeId: i.store_id,
                        quantity: i.quantity,
                    })),
                    fulfilmentType,
                    paymentMethod,
                    deliveryAddress,
                    userLocation: DEFAULT_USER_LOCATION,
                }),
            });

            const checkoutData = await checkoutRes.json();
            if (!checkoutData.success) {
                alert(`Checkout Error: ${checkoutData.error?.message || 'Inventory reservation failed'}`);
                setLoading(false);
                return;
            }

            const orders = checkoutData.data.orders;
            const firstOrder = orders[0];

            if (paymentMethod === 'ONLINE') {
                // Trigger Mock Payment Gateway
                const payRes = await fetch('/api/payments/mock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: firstOrder.id,
                        amount: grandTotal,
                        paymentMethod: 'ONLINE',
                        simulateResult: 'SUCCESS',
                    }),
                });
                const payData = await payRes.json();
                if (payData.success) {
                    router.push(`/orders/${firstOrder.id}`);
                } else {
                    alert('Payment Failed! Reservation released.');
                    router.push('/orders');
                }
            } else {
                // COD
                router.push(`/orders/${firstOrder.id}`);
            }
        } catch (e: any) {
            alert(`Error during checkout: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
                <p className="text-slate-500">Select fulfilment option and payment method</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Options */}
                <div className="lg:col-span-8 space-y-8">
                    {/* 1. Fulfilment Selection */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">1</span>
                            Choose Fulfilment Method
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div
                                onClick={() => setFulfilmentType('PICKUP')}
                                className={`p-4 rounded-2xl border cursor-pointer transition ${fulfilmentType === 'PICKUP' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <StoreIcon className="h-6 w-6 text-indigo-600 mb-2" />
                                <h3 className="font-bold text-slate-900 text-sm">Store Pickup</h3>
                                <p className="text-xs text-slate-500 mt-1">FREE — Ready in 1 hour at your chosen branch</p>
                                <span className="text-[11px] font-bold text-emerald-700 block mt-2">FREE</span>
                            </div>

                            <div
                                onClick={() => setFulfilmentType('LOCAL_DELIVERY')}
                                className={`p-4 rounded-2xl border cursor-pointer transition ${fulfilmentType === 'LOCAL_DELIVERY' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <Truck className="h-6 w-6 text-indigo-600 mb-2" />
                                <h3 className="font-bold text-slate-900 text-sm">Local Delivery</h3>
                                <p className="text-xs text-slate-500 mt-1">Same-Day express courier from store</p>
                                <span className="text-[11px] font-bold text-slate-900 block mt-2">₹49 (Distance Tier)</span>
                            </div>

                            <div
                                onClick={() => setFulfilmentType('SHIPPING')}
                                className={`p-4 rounded-2xl border cursor-pointer transition ${fulfilmentType === 'SHIPPING' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <Package className="h-6 w-6 text-indigo-600 mb-2" />
                                <h3 className="font-bold text-slate-900 text-sm">Shipping</h3>
                                <p className="text-xs text-slate-500 mt-1">Domestic courier dispatch (2-4 days)</p>
                                <span className="text-[11px] font-bold text-slate-900 block mt-2">₹149 Flat Rate</span>
                            </div>
                        </div>

                        {fulfilmentType !== 'PICKUP' && (
                            <div className="pt-4 space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase">Delivery Address</label>
                                <textarea
                                    rows={2}
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                ></textarea>
                            </div>
                        )}
                    </div>

                    {/* 2. Payment Method */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <span className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black">2</span>
                            Payment Method
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div
                                onClick={() => setPaymentMethod('ONLINE')}
                                className={`p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === 'ONLINE' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <CreditCard className="h-6 w-6 text-indigo-600 mb-2" />
                                <h3 className="font-bold text-slate-900 text-sm">Online Payment (Mock Gateway)</h3>
                                <p className="text-xs text-slate-500 mt-1">UPI, Credit/Debit Cards, NetBanking</p>
                                <span className="text-[11px] font-semibold text-indigo-600 block mt-2">Instant Confirmation</span>
                            </div>

                            <div
                                onClick={() => setPaymentMethod('COD')}
                                className={`p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <Banknote className="h-6 w-6 text-indigo-600 mb-2" />
                                <h3 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h3>
                                <p className="text-xs text-slate-500 mt-1">Pay cash at store pickup or delivery</p>
                                <span className="text-[11px] font-semibold text-slate-700 block mt-2">24h Pickup Window</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary & Place Order */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold text-slate-900">Summary & Finalize</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Items Subtotal</span>
                                <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Fulfilment ({fulfilmentType})</span>
                                <span className="font-bold text-slate-900">
                                    {deliveryFee > 0 ? `₹${deliveryFee}` : shippingFee > 0 ? `₹${shippingFee}` : 'FREE'}
                                </span>
                            </div>
                            <div className="border-t border-slate-100 pt-3 flex justify-between text-lg font-black text-slate-900">
                                <span>Grand Total</span>
                                <span className="text-indigo-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Mandatory Policy Checkbox */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                            <div className="flex items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    id="policyCheck"
                                    checked={policyAccepted}
                                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="policyCheck" className="text-xs text-slate-700 leading-normal cursor-pointer">
                                    "By placing this order, you acknowledge SALESTORM's cancellation and no-return/no-replacement policy, subject to applicable law."
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30"
                        >
                            <Lock className="h-4 w-4" /> {loading ? 'RESERVING & PROCESSING...' : 'PLACE ORDER'}
                        </button>

                        <p className="text-[11px] text-center text-slate-400 font-medium">
                            🔒 256-Bit SSL Encrypted & Optimistic Concurrency Guaranteed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
