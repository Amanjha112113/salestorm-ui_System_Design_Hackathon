'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Store as StoreIcon, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { Store } from '@/lib/types';
import { DEFAULT_USER_LOCATION } from '@/lib/services/location';

export default function StoresPage() {
    const [stores, setStores] = useState<(Store & { distance_km: number })[]>([]);

    useEffect(() => {
        fetch(`/api/stores?lat=${DEFAULT_USER_LOCATION.latitude}&lng=${DEFAULT_USER_LOCATION.longitude}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setStores(data.data);
            });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Electronics Retail Stores</h1>
                <p className="text-slate-500">Discover physical stores nearby for instant pickup and local express delivery</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                    <div key={store.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {store.company_name}
                                </span>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                                    🟢 {store.status}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900">{store.name}</h2>
                            <p className="text-xs text-slate-500 flex items-start gap-1">
                                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                {store.address}, {store.city}, {store.state} - {store.pincode}
                            </p>

                            <div className="pt-2 text-xs text-slate-600 space-y-1">
                                <p className="flex items-center gap-1.5 font-bold text-indigo-700">
                                    <MapPin className="h-3.5 w-3.5" /> {store.distance_km} km away
                                </p>
                                <p className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {store.opening_time} - {store.closing_time}
                                </p>
                                <p className="flex items-center gap-1.5">
                                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {store.phone}
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">Pickup & Delivery Available</span>
                            <Link
                                href={`/stores/${store.id}`}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1"
                            >
                                Browse Store Products <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
