import { EventCategory } from '@/types';

const TM_API_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = process.env.TICKETMASTER_API_KEY;

export interface TicketmasterSearchParams {
    city?: string;
    keyword?: string;
    classificationName?: string;
    size?: number;
}

export async function searchTicketmasterEvents(params: TicketmasterSearchParams) {
    if (!API_KEY) {
        console.warn('Ticketmaster API key not found. Returning empty results.');
        return [];
    }

    try {
        const queryParams = new URLSearchParams({
            apikey: API_KEY,
            sort: 'date,asc',
            ...(params.city && { city: params.city }),
            ...(params.keyword && { keyword: params.keyword }),
            ...(params.classificationName && { classificationName: params.classificationName }),
            size: (params.size || 20).toString(),
        });

        const url = `${TM_API_URL}/events.json?${queryParams.toString()}`;
        const response = await fetch(url, { next: { revalidate: 3600 } });

        if (!response.ok) {
            console.error(`Ticketmaster API error: ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        const events = data._embedded?.events || [];
        
        return events.map(normalizeTicketmasterEvent);
    } catch (error) {
        console.error('Error fetching from Ticketmaster:', error);
        return [];
    }
}

function normalizeTicketmasterEvent(tmEvent: any) {
    const images = tmEvent.images || [];
    // Prefer 16:9 images with highest resolution
    const bestImage = images.find((img: any) => img.ratio === '16_9' && img.width >= 600) || images[0];

    const venues = tmEvent._embedded?.venues || [];
    const venue = venues[0];
    const location = venue ? `${venue.name}, ${venue.city?.name}` : 'TBA';
    const city = venue?.city?.name || '';

    const classifications = tmEvent.classifications || [];
    const segment = classifications[0]?.segment?.name || '';
    const category = getCategoryMapping(segment);

    const priceRanges = tmEvent.priceRanges || [];
    const minPrice = priceRanges.length > 0 ? priceRanges[0].min : 0;

    return {
        externalId: tmEvent.id,
        title: tmEvent.name,
        description: tmEvent.info || tmEvent.description || 'No description available.',
        image: bestImage?.url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
        category,
        date: tmEvent.dates.start.dateTime || tmEvent.dates.start.localDate,
        time: tmEvent.dates.start.localTime || '00:00',
        location,
        city,
        price: minPrice,
        externalLink: tmEvent.url,
        rawData: JSON.stringify(tmEvent),
    };
}

function getCategoryMapping(tmSegment: string): string {
    const segmentMap: Record<string, string> = {
        'Music': 'Music',
        'Sports': 'Sports',
        'Arts & Theatre': 'Cultural',
        'Film': 'Cultural',
        'Miscellaneous': 'Social',
        'Family': 'Social',
    };
    return segmentMap[tmSegment] || 'Social';
}
