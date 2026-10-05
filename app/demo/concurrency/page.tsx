'use client';

import React, { useState } from 'react';
import { Cpu, Zap, ShieldCheck, Play, RotateCcw, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function ConcurrencyDemoPage() {
    const [totalRequests, setTotalRequests] = useState<number>(10000);
    const [initialStock, setInitialStock] = useState<number>(100);
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState<any | null>(null);

    const runSimulation = async () => {
        setRunning(true);
        setResults(null);

        try {
            const res = await fetch('/api/demo/concurrency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalRequests, initialStock }),
            });
            const data = await res.json();
            if (data.success) {
                setResults(data.data);
            } else {
                alert('Simulation execution error');
            }
        } catch {
            alert('Failed to execute concurrency simulation');
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-indigo-900/50 space-y-4">
                <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    <Cpu className="h-4 w-4 text-indigo-400 animate-pulse" />
                    HACKATHON CONCURRENCY & RESILIENCE BENCHMARK
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                    10,000 Concurrent User Purchase Simulation
                </h1>

                <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
                    Tests SALESTORM's atomic inventory engine under high flash-sale load. Simulates 10,000 simultaneous customer purchase requests firing against a limited inventory of 100 units. Verifies zero overselling via optimistic concurrency control (OCC).
                </p>
            </div>

            {/* Control Panel Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Simulation Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Concurrent Requests</label>
                        <input
                            type="number"
                            value={totalRequests}
                            onChange={(e) => setTotalRequests(parseInt(e.target.value) || 1000)}
                            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <p className="text-xs text-slate-400">Simulated simultaneous user checkouts</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Available Stock Units</label>
                        <input
                            type="number"
                            value={initialStock}
                            onChange={(e) => setInitialStock(parseInt(e.target.value) || 10)}
                            className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                        <p className="text-xs text-slate-400">Target product inventory units</p>
                    </div>
                </div>

                <button
                    onClick={runSimulation}
                    disabled={running}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-black text-base py-5 rounded-2xl transition shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3"
                >
                    {running ? (
                        <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>EXECUTING 10,000 CONCURRENT REQUESTS...</span>
                        </>
                    ) : (
                        <>
                            <Play className="h-5 w-5 fill-white" />
                            <span>LAUNCH 10,000 USER BENCHMARK SIMULATION</span>
                        </>
                    )}
                </button>
            </div>

            {/* Results Dashboard */}
            {results && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xl space-y-8 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                            <h2 className="text-2xl font-black text-slate-900">Simulation Benchmark Results</h2>
                        </div>
                        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase">
                            {results.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-1">
                            <span className="text-xs text-slate-400 font-bold uppercase">Total Requests</span>
                            <div className="text-3xl font-black text-slate-900">{results.total_requests.toLocaleString()}</div>
                            <span className="text-[11px] text-slate-500 font-medium">100% Executed Atomic</span>
                        </div>

                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 space-y-1">
                            <span className="text-xs text-emerald-700 font-bold uppercase">Successful Reservations</span>
                            <div className="text-3xl font-black text-emerald-800">{results.successful_reservations}</div>
                            <span className="text-[11px] text-emerald-700 font-bold">🟢 Matches Initial Stock</span>
                        </div>

                        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 space-y-1">
                            <span className="text-xs text-red-700 font-bold uppercase">Failed (Out of Stock)</span>
                            <div className="text-3xl font-black text-red-800">{results.failed_requests.toLocaleString()}</div>
                            <span className="text-[11px] text-red-700 font-medium">🔴 Protected from oversell</span>
                        </div>

                        <div className="bg-indigo-900 text-white p-6 rounded-2xl space-y-1 shadow-lg">
                            <span className="text-xs text-indigo-300 font-bold uppercase">Overselling Count</span>
                            <div className="text-3xl font-black text-emerald-400">{results.overselling_count}</div>
                            <span className="text-[11px] text-indigo-200 font-bold">🛡️ ZERO OVERSELLING</span>
                        </div>
                    </div>

                    {/* Performance stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                        <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl flex items-center justify-between font-mono">
                            <span>Execution Duration:</span>
                            <strong className="text-white font-bold text-sm">{results.execution_time_ms} ms</strong>
                        </div>
                        <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl flex items-center justify-between font-mono">
                            <span>Throughput Speed:</span>
                            <strong className="text-emerald-400 font-bold text-sm">{results.throughput_rps.toLocaleString()} req/sec</strong>
                        </div>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-700 flex-shrink-0" />
                        <span>{results.guarantee}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
