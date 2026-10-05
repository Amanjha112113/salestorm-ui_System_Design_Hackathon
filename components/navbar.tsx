'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    Zap,
    MapPin,
    Search,
    ShoppingCart,
    ShoppingBag,
    MessageSquare,
    User,
    Store,
    Gauge,
    Cpu,
    Shield,
    LogOut,
    LogIn,
    UserCheck,
} from 'lucide-react';
import { UserLocation } from '@/lib/types';
import { DEFAULT_USER_LOCATION } from '@/lib/services/location';
import { LocationModal } from './location-modal';
import { useAuth } from '@/lib/context/auth-context';

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { userRole, userProfile, isAuthenticated, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        fetchCartCount();
    }, []);

    const fetchCartCount = async () => {
        try {
            const res = await fetch('/api/cart?customerId=usr-customer-1');
            const data = await res.json();
            if (data.success && data.data) {
                const count = data.data.reduce((sum: number, item: any) => sum + item.quantity, 0);
                setCartCount(count);
            }
        } catch {
            // Ignore
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSignOut = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
                {/* Top Announcement Bar - Cleaned & Removed Dynamic Role Selector */}
                <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                            <Zap className="h-3.5 w-3.5 fill-emerald-400" />
                            TECHKART Concurrency Engine Active — Zero Overselling Guarantee
                        </span>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <Link href="/demo/concurrency" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                <Cpu className="h-3 w-3" /> 10k User Simulation
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Navbar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md group-hover:bg-indigo-700 transition">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">TECHKART</span>
                            <span className="block text-[10px] uppercase tracking-wider text-indigo-600 font-bold -mt-1">
                                Electronics near you
                            </span>
                        </div>
                    </Link>

                    {/* Location Picker Button */}
                    <button
                        onClick={() => setIsLocationOpen(true)}
                        className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl text-slate-700 font-medium text-sm transition"
                    >
                        <MapPin className="h-4 w-4 text-indigo-600" />
                        <span className="max-w-[140px] truncate">{userLocation.city}</span>
                        <span className="text-xs text-indigo-600 font-bold">Change</span>
                    </button>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="Search TECHKART products (e.g. iPhone 17, PS5, Sony)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100/80 pl-10 pr-4 py-2 rounded-xl text-sm border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    </form>

                    {/* Right Action Icons & Immutable Session Badge */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/stores"
                            className="hidden lg:flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition"
                        >
                            <Store className="h-4 w-4" />
                            Stores
                        </Link>

                        <Link
                            href="/chat"
                            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                            title="Store Chat"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Link>

                        <Link
                            href="/cart"
                            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                            title="Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/orders"
                            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Orders
                        </Link>

                        {/* Session Badge & Role Specific Actions */}
                        {isAuthenticated && userProfile ? (
                            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                                {userRole === 'BUSINESS' ? (
                                    <Link
                                        href="/business/dashboard"
                                        className="bg-emerald-600 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm"
                                    >
                                        <Gauge className="h-3.5 w-3.5" /> Merchant Dashboard
                                    </Link>
                                ) : userRole === 'ADMIN' ? (
                                    <Link
                                        href="/admin"
                                        className="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-slate-800 transition flex items-center gap-1 shadow-sm"
                                    >
                                        <Shield className="h-3.5 w-3.5" /> Admin Control
                                    </Link>
                                ) : (
                                    <div className="hidden md:flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-indigo-200">
                                        <UserCheck className="h-3.5 w-3.5" />
                                        <span>Customer</span>
                                    </div>
                                )}

                                <button
                                    onClick={handleSignOut}
                                    title="Sign Out"
                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1 text-xs font-bold"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden xl:inline">Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-indigo-700 transition flex items-center gap-1 shadow-sm"
                                >
                                    <LogIn className="h-3.5 w-3.5" /> Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="hidden sm:inline-block bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Location Selector Modal */}
            <LocationModal
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                currentLocation={userLocation}
                onSelectLocation={(loc) => setUserLocation(loc)}
            />

            {/* Mobile Bottom Navigation Bar */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around py-2 px-1">
                <Link href="/" className={`flex flex-col items-center gap-1 text-xs font-medium ${pathname === '/' ? 'text-indigo-600' : 'text-slate-600'}`}>
                    <Zap className="h-5 w-5" /> Home
                </Link>
                <Link href="/buy" className={`flex flex-col items-center gap-1 text-xs font-medium ${pathname === '/buy' ? 'text-indigo-600' : 'text-slate-600'}`}>
                    <Search className="h-5 w-5" /> Discover
                </Link>
                <Link href="/cart" className={`flex flex-col items-center gap-1 text-xs font-medium ${pathname === '/cart' ? 'text-indigo-600' : 'text-slate-600'}`}>
                    <ShoppingCart className="h-5 w-5" /> Cart
                </Link>
                <Link href="/orders" className={`flex flex-col items-center gap-1 text-xs font-medium ${pathname === '/orders' ? 'text-indigo-600' : 'text-slate-600'}`}>
                    <ShoppingBag className="h-5 w-5" /> Orders
                </Link>
                <Link href="/profile" className={`flex flex-col items-center gap-1 text-xs font-medium ${pathname === '/profile' ? 'text-indigo-600' : 'text-slate-600'}`}>
                    <User className="h-5 w-5" /> Profile
                </Link>
            </nav>
        </>
    );
}
