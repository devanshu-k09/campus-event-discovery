'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
    return (
        <header className="pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="relative bg-gradient-to-br from-primary via-[#8b5cf6] to-accent-pink rounded-3xl overflow-hidden min-h-[460px] flex items-center shadow-2xl">

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    {/* Content */}
                    <div className="relative z-10 px-8 lg:px-16 w-full lg:w-2/3 py-10">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md border border-white/10">
                            University Edition
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-sm">
                            Discover Amazing <br />
                            Campus Events
                        </h1>
                        <p className="text-white/90 text-lg mb-8 max-w-lg leading-relaxed font-medium">
                            Connect with your community. From underground concerts to tech workshops, find what moves you this semester.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="bg-white text-primary hover:bg-slate-50 border-none font-bold shadow-xl transition-transform hover:scale-105" asChild>
                                <Link href="/events">Explore Now</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="bg-black/20 text-white border-white/30 backdrop-blur-md hover:bg-white/10 hover:text-white font-bold transition-transform hover:scale-105" asChild>
                                <Link href="/create-event">Host an Event</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="hidden lg:block absolute right-0 bottom-0 w-1/2 h-full">
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-primary/20 z-10" />
                        <Image
                            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"
                            alt="Students collaborating"
                            fill
                            className="object-cover opacity-90 mix-blend-overlay"
                            priority
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
