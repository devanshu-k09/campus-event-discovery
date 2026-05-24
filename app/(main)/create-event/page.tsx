'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EventForm from '@/components/events/EventForm';

function CreateEventContent() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get('id') || undefined;
    return <EventForm eventId={eventId} />;
}

export default function CreateEventPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
            <CreateEventContent />
        </Suspense>
    );
}
