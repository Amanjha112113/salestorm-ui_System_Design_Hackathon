'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Check, X } from 'lucide-react';
import { UserLocation } from '@/lib/types';
import { DEFAULT_USER_LOCATION } from '@/lib/services/location';

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLocation: UserLocation;
    onSelectLocation: (loc: UserLocation) => void;
}

const POPULAR_CITIES = [
    { city: 'Tirunelveli', latitude: 8.7139, longitude: 77.7567, pincode: '627005' },
    { city: 'Madurai', latitude: 9.9252, longitude: 78.1198, pincode: '625001' },
    { city: 'Chennai', latitude: 13.0827, longitude: 80.2707, pincode: '600002' },
    { city: 'Coimbatore', latitude: 11.0168, longitude: 76.9558, pincode: '641002' },
];

export function LocationModal({ isOpen, onClose, currentLocation, onSelectLocation }: LocationModalProps) {
    const [pincodeInput, setPincodeInput] = useState('');
    const [gpsLoading, setGpsLoading] = useState(false);

    if (!isOpen) return null;

    const handleUseCurrentLocation = () => {
        setGpsLoading(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setGpsLoading(false);
                    onSelectLocation({
                        city: 'Your Location',
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    });
                    onClose();
                },
                () => {
                    setGpsLoading(false);
                    // Fallback to Tirunelveli
                    onSelectLocation(DEFAULT_USER_LOCATION);
                    onClose();
                }
            );
        } else {
            setGpsLoading(false);
            onSelectLocation(DEFAULT_USER_LOCATION);
            onClose();
        }
    };

    const handlePincodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pincodeInput) return;
        onSelectLocation({
            city: `Pincode ${pincodeInput}`,
            latitude: DEFAULT_USER_LOCATION.latitude,
            longitude: DEFAULT_USER_LOCATION.longitude,
            pincode: pincodeInput,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-indigo-600" />
                        <h2 className="text-xl font-bold text-slate-900">Where are you shopping from?</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="py-4 space-y-4">
                    <button
                        onClick={handleUseCurrentLocation}
                        disabled={gpsLoading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-3 px-4 rounded-xl font-semibold transition"
                    >
                        <Navigation className="h-5 w-5 animate-pulse" />
                        {gpsLoading ? 'Detecting GPS...' : 'Use Current Location'}
                    </button>

                    <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter 6-digit Pincode"
                            value={pincodeInput}
                            onChange={(e) => setPincodeInput(e.target.value)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button type="submit" className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-slate-800">
                            Apply
                        </button>
                    </form>

                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Major Electronics Hub</p>
                        <div className="grid grid-cols-2 gap-2">
                            {POPULAR_CITIES.map((c) => {
                                const isSelected = currentLocation.city === c.city;
                                return (
                                    <button
                                        key={c.city}
                                        onClick={() => {
                                            onSelectLocation(c);
                                            onClose();
                                        }}
                                        className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition ${isSelected
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{c.city}</span>
                                        {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
