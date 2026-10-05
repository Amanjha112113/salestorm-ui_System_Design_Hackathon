'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserCheck, Building2, ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = (searchParams.get('role')?.toUpperCase() === 'BUSINESS' ? 'BUSINESS' : 'CUSTOMER') as UserRole;

    const { loginAsCustomer, loginAsBusiness } = useAuth();
    const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRole === 'BUSINESS') {
            loginAsBusiness(email || 'seller@techkart.in');
            router.push('/business/dashboard');
        } else {
            loginAsCustomer(email || 'customer@techkart.in');
            router.push('/buy');
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">
                        ACCOUNT REGISTRATION
                    </span>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create your TECHKART Account</h1>
                    <p className="text-xs text-slate-500">Select your account role to get started</p>
                </div>

                {/* Role Selector Card */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => setSelectedRole('CUSTOMER')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl font-bold text-xs transition ${selectedRole === 'CUSTOMER'
                                ? 'bg-white text-indigo-600 shadow-md border border-slate-200/60'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <UserCheck className="h-6 w-6 mb-1.5" />
                        <span>Customer</span>
                        <span className="text-[10px] font-normal text-slate-400 mt-0.5">Discover & Buy</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedRole('BUSINESS')}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl font-bold text-xs transition ${selectedRole === 'BUSINESS'
                                ? 'bg-white text-emerald-600 shadow-md border border-slate-200/60'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <Building2 className="h-6 w-6 mb-1.5" />
                        <span>Business Retailer</span>
                        <span className="text-[10px] font-normal text-slate-400 mt-0.5">Sell & Store Stock</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Full Name</label>
                        <div className="relative">
                            <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Dharshan Kumar"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {selectedRole === 'BUSINESS' && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Company / Business Name</label>
                            <div className="relative">
                                <Building2 className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="TechZone Retail Pvt Ltd"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={selectedRole === 'BUSINESS' ? 'seller@techkart.in' : 'customer@techkart.in'}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Phone Number</label>
                            <div className="relative">
                                <Phone className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>
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
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-md ${selectedRole === 'BUSINESS' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        Register as {selectedRole === 'BUSINESS' ? 'Business Retailer' : 'Customer'} <ArrowRight className="h-4 w-4" />
                    </button>
                </form>

                {/* Login redirect */}
                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                    Already have an account?{' '}
                    <Link
                        href={selectedRole === 'BUSINESS' ? '/business/login' : '/login'}
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        Sign In Here →
                    </Link>
                </div>
            </div>
        </div>
    );
}
