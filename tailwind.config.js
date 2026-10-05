/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                brand: {
                    50: '#f0f4ff',
                    100: '#e0e9fe',
                    500: '#4f46e5',
                    600: '#4338ca',
                    700: '#3730a3',
                    900: '#0f172a',
                },
                primary: {
                    DEFAULT: '#2563eb',
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#475569',
                    foreground: '#ffffff',
                },
                success: {
                    DEFAULT: '#10b981',
                    foreground: '#ffffff',
                },
                danger: {
                    DEFAULT: '#ef4444',
                    foreground: '#ffffff',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    foreground: '#ffffff',
                },
            },
            borderRadius: {
                lg: '0.75rem',
                md: '0.5rem',
                sm: '0.25rem',
            },
        },
    },
    plugins: [],
};
