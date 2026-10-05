'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, MapPin, Store as StoreIcon } from 'lucide-react';
import { StockBadge } from '@/components/stock-badge';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setResults(data.data);
                setLoading(false);
            });
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    Search Results for "{query}"
                </h1>
                <p className="text-slate-500">Showing available physical stores and inventory near your location</p>
            </div>

            {loading ? (
                <div className="py-16 text-center text-slate-500">Searching store inventory...</div>
            ) : results.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <SearchIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900">No products found matching "{query}"</h3>
                    <p className="text-xs text-slate-500 mt-1">Try searching for "iPhone", "PS5", "MacBook", or "Sony"</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {results.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition space-y-4">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-24 w-24 bg-slate-50 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                                        <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{product.brand}</span>
                                        <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                                        <p className="text-xs text-slate-500 font-mono">SKU: {product.sku}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-3xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                                    <div className="mt-1">
                                        <StockBadge available={product.total_stock} />
                                    </div>
                                </div>
                            </div>

                            {/* Available Stores Breakdown */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Stores carrying this product near you:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {product.stores.map((sItem: any) => (
                                        <div key={sItem.store.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                                            <div>
                                                <span className="font-bold text-slate-900 block">{sItem.store.name}</span>
                                                <span className="text-slate-500 flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-indigo-600" /> {sItem.distance_km} km — Stock: <strong>{sItem.available_quantity}</strong>
                                                </span>
                                            </div>
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                                            >
                                                Buy Now
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="py-16 text-center text-slate-500">Searching store inventory...</div>}>
            <SearchContent />
        </Suspense>
    );
}
