'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Shield, Store, MapPin, Mail, Phone, Lock } from 'lucide-react';

export default function ProfilePage() {
    const [role, setRole] = useState<'CUSTOMER' | 'BUSINESS' | 'ADMIN'>('CUSTOMER');

    const handleRoleChange = (newRole: 'CUSTOMER' | 'BUSINESS' | 'ADMIN') => {
        setRole(newRole);
        localStorage.setItem('salestorm_role', newRole);
        alert(`Active view updated to ${newRole}`);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Account</h1>
                <p className="text-slate-500">Manage profile settings and switch demo perspectives</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="h-16 w-16 bg-indigo-600 text-white font-black text-2xl rounded-2xl flex items-center justify-center">
                        US
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Demonstration User</h2>
                        <p className="text-xs text-slate-500 font-mono">ID: usr-customer-1</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold uppercase">Email</span>
                        <p className="text-slate-900 font-bold flex items-center gap-1.5"><Mail className="h-4 w-4 text-indigo-600" /> user@salestorm.in</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-slate-400 font-semibold uppercase">Phone</span>
                        <p className="text-slate-900 font-bold flex items-center gap-1.5"><Phone className="h-4 w-4 text-indigo-600" /> +91 98765 43210</p>
                    </div>
                </div>

                {/* Role Quick Switcher for Hackathon Demo */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="h-4 w-4 text-indigo-600" /> Platform Role Switcher (Hackathon Test)
                    </h3>
                    <p className="text-xs text-slate-500">Switch roles instantly to inspect Business and Admin interfaces:</p>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => handleRoleChange('CUSTOMER')}
                            className="bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs p-4 rounded-2xl text-center hover:bg-indigo-100"
                        >
                            Customer Perspective
                        </button>
                        <button
                            onClick={() => handleRoleChange('BUSINESS')}
                            className="bg-slate-900 border border-slate-800 text-white font-bold text-xs p-4 rounded-2xl text-center hover:bg-slate-800"
                        >
                            Business Retailer
                        </button>
                        <button
                            onClick={() => handleRoleChange('ADMIN')}
                            className="bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs p-4 rounded-2xl text-center hover:bg-amber-100"
                        >
                            Platform Administrator
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
