import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Truck, Store, AlertCircle } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 text-white p-2 rounded-xl">
                                <Zap className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tight">TECHKART</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Discover. Reserve. Buy. Electronics directly from physical retail stores near you. High-concurrency zero-overselling inventory engine.
                        </p>
                        <div className="pt-2 text-xs text-slate-500 font-mono">
                            TECHKART Multi-Store Electronics Platform v1.0
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Marketplace</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/buy" className="hover:text-white transition">Browse Electronics</Link></li>
                            <li><Link href="/stores" className="hover:text-white transition">Nearby Stores</Link></li>
                            <li><Link href="/search" className="hover:text-white transition">Product Search</Link></li>
                            <li><Link href="/demo/concurrency" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">10k Concurrency Demo</Link></li>
                        </ul>
                    </div>

                    {/* User & Business */}
                    <div>
                        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Portals & Roles</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/login" className="hover:text-white transition">Customer Portal Login</Link></li>
                            <li><Link href="/business/login" className="hover:text-white transition">Business Retailer Login</Link></li>
                            <li><Link href="/admin/login" className="hover:text-white transition">Platform Admin Login</Link></li>
                            <li><Link href="/orders" className="hover:text-white transition">Order Tracking</Link></li>
                        </ul>
                    </div>

                    {/* Policy Notice */}
                    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
                            <AlertCircle className="h-4 w-4" /> Policy Acknowledgement
                        </div>
                        <p className="text-xs text-slate-400 leading-normal">
                            TECHKART does not offer returns or replacements for change-of-mind purchases. Defective or wrong items can be reported via "Report an Issue".
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                    <p>© {new Date().getFullYear()} TECHKART Electronics Marketplace. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Real-time OCC Engine</span>
                        <span className="flex items-center gap-1"><Store className="h-4 w-4 text-indigo-400" /> Multi-Store Inventory</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
