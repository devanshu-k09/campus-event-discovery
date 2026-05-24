'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                <div className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full w-9 h-9 transition-all duration-300 hover:bg-primary/10"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-primary transition-all scale-100 rotate-0" />
            ) : (
                <Sun className="h-4 w-4 text-yellow-500 transition-all scale-100 rotate-0" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
