'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Store, MapPin } from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { StockBadge } from '@/components/stock-badge';

export default function BuyPage() {
    const [products, setProducts] = useState<(Product & { total_stock?: number; stores?: any[] })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/search')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setProducts(data.data);
            });

        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                // fetch categories
            });

        setLoading(false);
    }, []);

    const filteredProducts = products.filter((p) => {
        const matchCategory = selectedCategory === 'ALL' || p.category_id === selectedCategory;
        const matchQuery =
            !searchQuery ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchQuery;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Electronics Marketplace</h1>
                <p className="text-slate-500">Discover and buy electronics with real-time physical store inventory</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search brand, model, SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedCategory === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        All Products
                    </button>
                    <button
                        onClick={() => setSelectedCategory('cat-smartphones')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedCategory === 'cat-smartphones' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        Smartphones
                    </button>
                    <button
                        onClick={() => setSelectedCategory('cat-laptops')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedCategory === 'cat-laptops' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        Laptops
                    </button>
                    <button
                        onClick={() => setSelectedCategory('cat-gaming')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${selectedCategory === 'cat-gaming' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        Gaming
                    </button>
                </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                    const nearest = product.stores?.[0];
                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                        >
                            <div>
                                <div className="h-48 bg-slate-50 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center p-4">
                                    <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
                                    <div className="absolute top-3 left-3">
                                        <StockBadge available={product.total_stock || 0} />
                                    </div>
                                </div>

                                <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{product.brand}</div>
                                <h3 className="text-base font-bold text-slate-900 mt-1 hover:text-indigo-600">
                                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.description}</p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                                    {nearest && (
                                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                            <MapPin className="h-3 w-3 text-indigo-600" /> {nearest.distance_km} km away
                                        </span>
                                    )}
                                </div>

                                <Link
                                    href={`/products/${product.id}`}
                                    className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition"
                                >
                                    VIEW STORES & BUY NOW
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
