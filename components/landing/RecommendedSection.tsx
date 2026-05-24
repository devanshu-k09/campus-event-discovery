'use client';

import { useState, useEffect } from 'react';
import { SmartEvent } from '@/types';
import { EventSection } from './EventSection';

interface RecommendedSectionProps {
    initialEvents: SmartEvent[];
    isLoggedIn: boolean;
    excludeEventIds?: string[];
}

export function RecommendedSection({ 
    initialEvents, 
    isLoggedIn, 
    excludeEventIds = [] 
}: RecommendedSectionProps) {
    const excludeIdsStr = excludeEventIds.join(',');
    
    // Filter out excluded events helper
    const filterExcluded = (evs: SmartEvent[]) => {
        const excludeSet = new Set(excludeEventIds);
        return evs.filter(e => !excludeSet.has(e.id));
    };

    const [events, setEvents] = useState<SmartEvent[]>(() => filterExcluded(initialEvents));
    const [loading, setLoading] = useState(false);

    // Keep state in sync with initialEvents and excludeEventIds if not logged in
    useEffect(() => {
        if (!isLoggedIn) {
            setEvents(filterExcluded(initialEvents));
        }
    }, [initialEvents, isLoggedIn, excludeIdsStr]);

    useEffect(() => {
        if (!isLoggedIn) return;

        // Fetch personalized recommendations
        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/recommendations');
                if (res.ok) {
                    const data = await res.json();
                    if (data.events && data.events.length > 0) {
                        setEvents(filterExcluded(data.events));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [isLoggedIn, excludeIdsStr]);

    return (
        <EventSection
            title="Recommended For You"
            subtitle={isLoggedIn ? "Based on your interests and past interactions" : "Popular picks for you"}
            events={events}
            loading={loading}
            hideIfEmpty={true}
        />
    );
}
