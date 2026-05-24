'use client';

import { useState, useEffect } from 'react';
import { SmartEvent } from '@/types';
import { EventSection } from './EventSection';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NearYouSectionProps {
    excludeEventIds?: string[];
}

export function NearYouSection({ excludeEventIds = [] }: NearYouSectionProps) {
    const [events, setEvents] = useState<SmartEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState<string>('Mumbai'); // Default
    const [locationDenied, setLocationDenied] = useState(false);

    const excludeIdsStr = excludeEventIds.join(',');

    useEffect(() => {
        // Try to get user's location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        // Reverse geocode to get city (simple approximation using free API or fallback)
                        // For demo, we'll just set a mock city based on coordinates or skip
                        // In a real app, use Google Maps or Mapbox reverse geocoding
                        fetchEvents(city); // Fallback to default for now
                    } catch (e) {
                        fetchEvents(city);
                    }
                },
                (error) => {
                    console.log("Geolocation denied or error", error);
                    setLocationDenied(true);
                    fetchEvents(city);
                }
            );
        } else {
            fetchEvents(city);
        }
    }, [city, excludeIdsStr]);

    const fetchEvents = async (targetCity: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/events/near-you?city=${encodeURIComponent(targetCity)}`);
            if (res.ok) {
                const data = await res.json();
                const fetchedEvents: SmartEvent[] = data.events || [];
                const excludeSet = new Set(excludeEventIds);
                setEvents(fetchedEvents.filter(e => !excludeSet.has(e.id)));
            }
        } catch (error) {
            console.error('Failed to fetch nearby events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <EventSection
                title="Near You"
                subtitle={`Events happening in and around ${city}`}
                events={events}
                loading={loading}
                emptyMessage={`No events found in ${city}. Try exploring other locations.`}
            />
            {locationDenied && (
                <div className="absolute top-0 right-0 mt-2 mr-4 hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    Using default location
                </div>
            )}
        </div>
    );
}
