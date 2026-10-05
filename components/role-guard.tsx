'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { UserRole } from '@/lib/types';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectPath?: string;
}

export function RoleGuard({ children, allowedRoles, redirectPath }: RoleGuardProps) {
    const { userRole, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            const fallback = redirectPath || (allowedRoles.includes('BUSINESS') ? '/business/login' : allowedRoles.includes('ADMIN') ? '/admin/login' : '/login');
            router.push(fallback);
            return;
        }

        if (!allowedRoles.includes(userRole)) {
            if (allowedRoles.includes('BUSINESS')) {
                router.push('/business/login');
            } else if (allowedRoles.includes('ADMIN')) {
                router.push('/admin/login');
            } else {
                router.push('/login');
            }
        }
    }, [userRole, isAuthenticated, allowedRoles, redirectPath, router]);

    if (!isAuthenticated || !allowedRoles.includes(userRole)) {
        return (
            <div className="min-h-[400px] flex items-center justify-center p-8 text-center">
                <div className="space-y-3 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg max-w-md w-full">
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                        🛡️
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
                    <p className="text-xs text-slate-500">
                        This page requires <strong>{allowedRoles.join(' or ')}</strong> role security clearance. Redirecting to appropriate login portal...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
