'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Profile } from '@/lib/types';

interface AuthContextType {
    userRole: UserRole;
    userProfile: Profile | null;
    isAuthenticated: boolean;
    loginAsCustomer: (email?: string) => void;
    loginAsBusiness: (email?: string) => void;
    loginAsAdmin: (email?: string) => void;
    logout: () => void;
}

const defaultProfile: Profile = {
    id: 'usr-customer-1',
    full_name: 'TechKart Customer',
    email: 'customer@techkart.in',
    role: 'CUSTOMER',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
    userRole: 'CUSTOMER',
    userProfile: defaultProfile,
    isAuthenticated: true,
    loginAsCustomer: () => { },
    loginAsBusiness: () => { },
    loginAsAdmin: () => { },
    logout: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userRole, setUserRole] = useState<UserRole>('CUSTOMER');
    const [userProfile, setUserProfile] = useState<Profile | null>(defaultProfile);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

    useEffect(() => {
        const savedRole = localStorage.getItem('techkart_role') as UserRole;
        if (savedRole) {
            setUserRole(savedRole);
            updateProfileForRole(savedRole);
        }
    }, []);

    const updateProfileForRole = (role: UserRole, email?: string) => {
        let name = 'TechKart Customer';
        let defaultEmail = 'customer@techkart.in';

        if (role === 'BUSINESS') {
            name = 'TechZone Store Manager';
            defaultEmail = 'business@techzone.in';
        } else if (role === 'ADMIN') {
            name = 'TechKart Platform Administrator';
            defaultEmail = 'admin@techkart.in';
        }

        const prof: Profile = {
            id: role === 'BUSINESS' ? 'usr-business-1' : role === 'ADMIN' ? 'usr-admin-1' : 'usr-customer-1',
            full_name: name,
            email: email || defaultEmail,
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setUserProfile(prof);
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem('techkart_role', role);
    };

    const loginAsCustomer = (email?: string) => updateProfileForRole('CUSTOMER', email);
    const loginAsBusiness = (email?: string) => updateProfileForRole('BUSINESS', email);
    const loginAsAdmin = (email?: string) => updateProfileForRole('ADMIN', email);

    const logout = () => {
        localStorage.removeItem('techkart_role');
        setIsAuthenticated(false);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{
                userRole,
                userProfile,
                isAuthenticated,
                loginAsCustomer,
                loginAsBusiness,
                loginAsAdmin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
