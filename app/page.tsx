'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Zap,
    MapPin,
    ShoppingBag,
    Store as StoreIcon,
    Search,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    Smartphone,
    Laptop,
    Tv,
    Headphones,
    Camera,
    Gamepad2,
    Watch,
    Keyboard,
    Clock,
    CheckCircle2,
} from 'lucide-react';
import { Store, Product, UserLocation } from '@/lib/types';
import { DEFAULT_USER_LOCATION } from '@/lib/services/location';
import { StockBadge } from '@/components/stock-badge';
import { LocationModal } from '@/components/location-modal';

const CATEGORIES = [
    { name: 'Smartphones', icon: Smartphone, href: '/search?q=Smartphones' },
    { name: 'Laptops', icon: Laptop, href: '/search?q=Laptops' },
    { name: 'TVs & Displays', icon: Tv, href: '/search?q=TVs' },
    { name: 'Headphones', icon: Headphones, href: '/search?q=Headphones' },
    { name: 'Cameras', icon: Camera, href: '/search?q=Cameras' },
    { name: 'Gaming Consoles', icon: Gamepad2, href: '/search?q=Gaming' },
    { name: 'Smartwatches', icon: Watch, href: '/search?q=Smartwatches' },
    { name: 'Accessories', icon: Keyboard, href: '/search?q=Accessories' },
];

export default function HomePage() {
    const router = useRouter();
    const [userLoc, setUserLoc] = useState<UserLocation>(DEFAULT_USER_LOCATION);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [stores, setStores] = useState<(Store & { distance_km: number })[]>([]);
    const [popularProducts, setPopularProducts] = useState<(Product & { stores: any[]; total_stock?: number })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [userLoc]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch nearby stores
            const storeRes = await fetch(`/api/stores?city=${userLoc.city}&lat=${userLoc.latitude}&lng=${userLoc.longitude}`);
            const storeData = await storeRes.json();
            if (storeData.success) setStores(storeData.data);

            // Fetch popular electronics
            const prodRes = await fetch(`/api/search?lat=${userLoc.latitude}&lng=${userLoc.longitude}`);
            const prodData = await prodRes.json();
            if (prodData.success) setPopularProducts(prodData.data.slice(0, 6));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-16">
            {/* Dual CTA Hero Banner */}
            <section className="relative overflow-hidden gradient-hero text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            High-Concurrency Location-Aware Electronics Marketplace
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                            Discover. Reserve. Buy.
                            <span className="block text-indigo-400">Electronics from stores near you.</span>
                        </h1>

                        <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                            Connect with verified physical electronics retailers in your city. Check live store inventory, reserve items with 0% overselling guarantee, and pick up in-store or get local express delivery.
                        </p>

                        {/* Main Action Buttons */}
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/buy"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                BUY ELECTRONICS
                            </Link>

                            <Link
                                href="/business/dashboard"
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base px-8 py-4 rounded-2xl transition flex items-center gap-2"
                            >
                                <StoreIcon className="h-5 w-5 text-indigo-400" />
                                BUSINESS LOGIN
                            </Link>

                            <button
                                onClick={() => setIsLocationOpen(true)}
                                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-slate-300 text-sm font-semibold px-5 py-4 rounded-2xl flex items-center gap-2 backdrop-blur-md"
                            >
                                <MapPin className="h-4 w-4 text-indigo-400" />
                                <span>Shopping in: <strong className="text-white">{userLoc.city}</strong></span>
                            </button>
                        </div>

                        {/* Highlights */}
                        <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span>Live Store Stock</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span>Express Store Pickup</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                                <span>10k User Concurrency</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Banner Visual Card */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping"></div>
                                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Live Inventory Monitor</span>
                                </div>
                                <span className="text-xs text-slate-400 font-mono">Tirunelveli Hub</span>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Apple iPhone 17 Pro 256GB</h4>
                                        <p className="text-xs text-slate-400">TechZone Tirunelveli — 2.3 km away</p>
                                    </div>
                                    <StockBadge available={4} />
                                </div>

                                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">Sony PlayStation 5 Pro 2TB</h4>
                                        <p className="text-xs text-slate-400">Digital World Palayamkottai — 4.1 km away</p>
                                    </div>
                                    <StockBadge available={10} />
                                </div>

                                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">MacBook Air 15" M3</h4>
                                        <p className="text-xs text-slate-400">TechZone Tirunelveli — 2.3 km away</p>
                                    </div>
                                    <StockBadge available={8} />
                                </div>
                            </div>

                            <Link
                                href="/demo/concurrency"
                                className="w-full mt-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 py-3 rounded-xl text-xs font-bold text-center block transition"
                            >
                                ⚡ TEST 10,000 CONCURRENT USER BUY SIMULATION
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Electronics Categories</h2>
                        <p className="text-sm text-slate-500">Browse store inventory by department</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-500 hover:shadow-lg transition flex flex-col items-center text-center group"
                            >
                                <div className="bg-slate-100 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 p-3 rounded-xl mb-3 transition">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">{cat.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Stores Near You Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Stores Near You</h2>
                        <p className="text-sm text-slate-500">Physical retail outlets in {userLoc.city}</p>
                    </div>
                    <Link href="/stores" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        View All Stores <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-44 bg-slate-200/60 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stores.map((store) => (
                            <div
                                key={store.id}
                                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                            {store.company_name}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {store.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 pt-1">{store.name}</h3>
                                    <p className="text-xs text-slate-500">{store.address}, {store.city}</p>

                                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 font-medium">
                                        <span className="flex items-center gap-1 text-slate-900 font-bold">
                                            <MapPin className="h-3.5 w-3.5 text-indigo-600" /> {store.distance_km} km away
                                        </span>
                                        <span>Hours: {store.opening_time} - {store.closing_time}</span>
                                    </div>
                                </div>

                                <div className="pt-5 flex items-center justify-between border-t border-slate-100 mt-4">
                                    <span className="text-xs text-slate-500">Express Store Pickup Available</span>
                                    <Link
                                        href={`/stores/${store.id}`}
                                        className="bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-xl transition"
                                    >
                                        View Store
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Popular Electronics Near You Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Popular Electronics Near You</h2>
                        <p className="text-sm text-slate-500">Live store stock ready for pickup or local delivery</p>
                    </div>
                    <Link href="/buy" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        Explore All Products <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularProducts.map((product) => {
                        const nearestStore = product.stores[0];
                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col justify-between group"
                            >
                                <div className="p-6">
                                    <div className="h-48 bg-slate-100 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center p-4">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <StockBadge available={product.total_stock || 0} />
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{product.brand}</div>
                                    <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 line-clamp-1">
                                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                                    </h3>

                                    <div className="mt-3 flex items-baseline justify-between">
                                        <span className="text-xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                                        {nearestStore && (
                                            <span className="text-xs text-slate-500 font-medium">
                                                Closest: <strong className="text-indigo-600">{nearestStore.distance_km} km</strong> ({nearestStore.available_quantity} left)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
                                    >
                                        VIEW PRODUCT & STORES
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Location Modal */}
            <LocationModal
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                currentLocation={userLoc}
                onSelectLocation={(loc) => setUserLoc(loc)}
            />
        </div>
    );
}
