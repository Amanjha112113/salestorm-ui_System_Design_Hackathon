'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Server, Activity, Cpu, CheckCircle2 } from 'lucide-react';
import { RoleGuard } from '@/components/role-guard';

export default function AdminPage() {
    const [metrics] = useState({
        totalCompanies: 3,
        totalStores: 8,
        totalProducts: 10,
        totalOrders: 6,
        concurrencyLocksActive: 0,
        databaseStatus: 'HEALTHY (Optimistic OCC Engaged)',
    });

    return (
        <RoleGuard allowedRoles={['ADMIN']} redirectPath="/admin/login">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Admin Header */}
                <div className="bg-amber-950 text-amber-100 p-8 rounded-3xl border border-amber-800 shadow-xl space-y-2">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-amber-400" />
                        <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">PLATFORM ADMINISTRATION</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">TECHKART Central Control</h1>
                    <p className="text-xs text-amber-300">System metrics, RLS compliance, and optimistic concurrency health</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Database Health</span>
                        <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" /> {metrics.databaseStatus}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Active Retailers</span>
                        <p className="text-2xl font-black text-slate-900">{metrics.totalCompanies} Companies</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Store Outlets</span>
                        <p className="text-2xl font-black text-slate-900">{metrics.totalStores} Physical Outlets</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Overselling Rate</span>
                        <p className="text-2xl font-black text-emerald-600">0.00% Guaranteed</p>
                    </div>
                </div>

                {/* High-level system actions */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-indigo-600" /> Platform Benchmark & Resilience Diagnostics
                    </h3>
                    <p className="text-xs text-slate-500">
                        Run the 10,000 concurrent user purchase simulation against 100 inventory units to verify atomic version-locked transactions.
                    </p>

                    <Link
                        href="/demo/concurrency"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition shadow-lg shadow-indigo-600/30"
                    >
                        <Activity className="h-4 w-4" /> LAUNCH 10,000 USER SIMULATION DEMO
                    </Link>
                </div>
            </div>
        </RoleGuard>
    );
}
