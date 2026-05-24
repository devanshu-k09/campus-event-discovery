'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarCheck, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSession } from 'next-auth/react';
import { UserAccountNav } from '@/components/shared/UserAccountNav';
import { trackInteraction } from '@/app/actions/interaction';

export function Navbar({ onSearch }: { onSearch?: (query: string) => void }) {
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                            <CalendarCheck className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            Campus<span className="text-primary">Pulse</span>
                        </span>
                    </Link>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form 
                            className="relative w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const query = formData.get('search') as string;
                                if (query.trim()) {
                                    trackInteraction('search', undefined, undefined, { query: query.trim() });
                                    window.location.href = `/events?search=${encodeURIComponent(query.trim())}`;
                                }
                            }}
                        >
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="text-muted-foreground w-4 h-4" />
                            </span>
                            <Input
                                name="search"
                                className="block w-full pl-10 pr-3 py-2 border-none bg-secondary/50 focus:bg-background rounded-lg text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary transition-all"
                                placeholder="Search events, clubs, or venues..."
                                type="text"
                                onChange={(e) => onSearch?.(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Right Side Items */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        
                        {mounted && session?.user ? (
                            <UserAccountNav user={session.user} />
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="font-medium hover:text-primary transition-colors text-sm">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-lg">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
