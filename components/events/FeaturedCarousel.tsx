'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Event } from '@/types';
import EventCard from './EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedCarouselProps {
    events: Event[];
}

export function FeaturedCarousel({ events }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [mounted, setMounted] = useState(false);

    // Responsive items per page
    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, itemsPerPage]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(events.length / itemsPerPage));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + Math.ceil(events.length / itemsPerPage)) % Math.ceil(events.length / itemsPerPage));
    };

    // Ensure we don't access out of bounds
    const visibleEvents = [];
    for (let i = 0; i < itemsPerPage; i++) {
        const index = (currentIndex * itemsPerPage + i) % events.length;
        visibleEvents.push(events[index]);
    }

    if (!mounted) return <div className="h-48 flex items-center justify-center text-muted-foreground">Loading carousel...</div>;

    // If we don't have enough events to scroll (e.g., desktop with 3 events), just show them
    if (events.length <= itemsPerPage) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className="overflow-hidden py-4 -my-4 px-1">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={false}
                >
                    <AnimatePresence mode='popLayout'>
                        {visibleEvents.map((event) => (
                            <motion.div
                                key={`${event.id}-${currentIndex}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <EventCard event={event} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm z-10 hidden md:flex"
                onClick={prevSlide}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm z-10 hidden md:flex"
                onClick={nextSlide}
            >
                <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6 md:hidden">
                {Array.from({ length: Math.ceil(events.length / itemsPerPage) }).map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                            }`}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
}
