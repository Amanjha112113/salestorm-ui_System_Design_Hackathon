'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    MapPin,
    ShoppingCart,
    ShieldCheck,
    Truck,
    Store as StoreIcon,
    MessageSquare,
    Check,
    ChevronRight,
    Sparkles,
} from 'lucide-react';
import { Product, Store, StoreInventory } from '@/lib/types';
import { StockBadge } from '@/components/stock-badge';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [stores, setStores] = useState<(StoreInventory & { store: Store; distance_km?: number })[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    setProduct(data.data);
                    const storeList = data.data.available_stores || [];
                    setStores(storeList);
                    if (storeList.length > 0 && storeList[0].store) {
                        setSelectedStoreId(storeList[0].store.id);
                    }
                }
                setLoading(false);
            });
    }, [params.id]);

    const handleAddToCart = async (storeId: string) => {
        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: 'usr-customer-1',
                    productId: params.id,
                    storeId,
                    quantity: 1,
                }),
            });
            alert('Added to cart!');
        } catch {
            alert('Failed to add to cart');
        }
    };

    const handleBuyNow = async (storeId: string) => {
        await handleAddToCart(storeId);
        router.push('/cart');
    };

    if (loading || !product) {
        return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Loading Product Details...</div>;
    }

    const selectedStoreObj = stores.find((s) => s.store.id === selectedStoreId);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Link href="/" className="hover:text-indigo-600">Home</Link>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <Link href="/buy" className="hover:text-indigo-600">Electronics</Link>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-slate-900">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Product Media */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex items-center justify-center min-h-[380px] relative">
                        <img src={product.images[0]} alt={product.name} className="max-h-[340px] object-contain" />
                        <div className="absolute top-4 left-4">
                            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                {product.brand}
                            </span>
                        </div>
                    </div>

                    {/* Specifications Box */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            {Object.entries(product.specifications || {}).map(([key, val]) => (
                                <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-slate-400 font-medium block uppercase tracking-wider">{key}</span>
                                    <span className="text-slate-900 font-bold text-sm">{val}</span>
                                </div>
                            ))}
                        </div>
                        {product.warranty && (
                            <p className="text-xs text-indigo-700 bg-indigo-50 p-3 rounded-xl font-semibold flex items-center gap-2 border border-indigo-100">
                                <ShieldCheck className="h-4 w-4" /> Warranty: {product.warranty}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column: Multi-Store Inventory & Ordering */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{product.category_name}</span>
                            <h1 className="text-3xl font-black text-slate-900 leading-tight mt-1">{product.name}</h1>
                            <p className="text-xs text-slate-400 font-mono mt-1">SKU: {product.sku}</p>
                        </div>

                        <div className="flex items-baseline gap-3 pb-4 border-b border-slate-100">
                            <span className="text-4xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-slate-500 font-medium">Inclusive of all local store taxes</span>
                        </div>

                        {/* Store Selection List (Location-Aware Multi-Store Stock) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-900">Available Stores Near You</label>
                                <span className="text-xs text-indigo-600 font-semibold">{stores.length} physical stores carrying stock</span>
                            </div>

                            {stores.length === 0 ? (
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-semibold">
                                    Out of stock in nearby stores. Check back soon.
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {stores.map((item) => {
                                        const isSelected = selectedStoreId === item.store.id;
                                        return (
                                            <div
                                                key={item.store.id}
                                                onClick={() => setSelectedStoreId(item.store.id)}
                                                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${isSelected
                                                        ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                    }`}
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-900 text-sm">{item.store.name}</span>
                                                        <StockBadge available={item.available_quantity} />
                                                    </div>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                                                        {item.store.city} — {item.distance_km || 2.3} km away
                                                    </p>
                                                </div>

                                                {isSelected && <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {selectedStoreObj && (
                            <div className="space-y-3 pt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleAddToCart(selectedStoreObj.store.id)}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-md"
                                    >
                                        <ShoppingCart className="h-4 w-4" /> ADD TO CART
                                    </button>

                                    <button
                                        onClick={() => handleBuyNow(selectedStoreObj.store.id)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-4 rounded-2xl transition shadow-lg shadow-indigo-600/30"
                                    >
                                        BUY NOW
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-indigo-600" />
                                        <span>Store Pickup & Express Local Delivery available</span>
                                    </div>
                                    <Link href={`/stores/${selectedStoreObj.store.id}`} className="text-indigo-600 font-bold hover:underline">
                                        View Store Page
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
