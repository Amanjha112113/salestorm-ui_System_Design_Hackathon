'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';

export default function BusinessLoginPage() {
    const router = useRouter();
    const { loginAsBusiness } = useAuth();
    const [email, setEmail] = useState('business@techzone.in');
    const [password, setPassword] = useState('password123');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginAsBusiness(email);
        router.push('/business/dashboard');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                        <Building2 className="h-7 w-7" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                        BUSINESS MERCHANT PORTAL
                    </span>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">TECHKART Retailer Portal</h1>
                    <p className="text-xs text-slate-500">Manage physical stores, real-time inventory, and incoming store orders</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Business Email</label>
                        <div className="relative">
                            <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="business@techzone.in"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-md"
                    >
                        Access Business Dashboard <ArrowRight className="h-4 w-4" />
                    </button>
                </form>

                {/* Navigation & Registration */}
                <div className="pt-4 border-t border-slate-100 text-center space-y-3">
                    <p className="text-xs text-slate-500">
                        Need a Merchant Account?{' '}
                        <Link href="/register?role=business" className="text-emerald-700 font-bold hover:underline">
                            Register Business Here →
                        </Link>
                    </p>
                    <div className="flex gap-2 justify-center pt-2">
                        <Link
                            href="/login"
                            className="text-xs text-indigo-600 hover:underline font-bold bg-indigo-50 px-3 py-1.5 rounded-lg"
                        >
                            Customer Portal →
                        </Link>
                        <Link
                            href="/admin/login"
                            className="text-xs text-slate-600 hover:underline font-bold bg-slate-100 px-3 py-1.5 rounded-lg"
                        >
                            Admin Portal →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
