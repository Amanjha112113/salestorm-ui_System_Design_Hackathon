import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/lib/context/auth-context';

export const metadata: Metadata = {
    title: 'TECHKART — Location-Aware Electronics Marketplace',
    description: 'Discover. Reserve. Buy. Electronics from physical retail stores near you on TECHKART.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
                <AuthProvider>
                    <Navbar />
                    <main className="flex-1 pb-16 sm:pb-0">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
