export type EventCategory =
    | 'Academic'
    | 'Sports'
    | 'Cultural'
    | 'Tech'
    | 'Workshop'
    | 'Social'
    | 'Career'
    | 'Health';

export type EventStatus =
    | 'published'
    | 'draft'
    | 'cancelled'
    | 'completed';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    interests: EventCategory[];
    collegeName?: string;
    year?: string;
    department?: string;
    points: number;
    badges: Badge[];
    role: 'student' | 'organizer' | 'admin';
    createdAt: Date;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export type EventSource = 'internal' | 'external' | 'ai';

export type EventBadge = 'Live Event' | 'AI Pick' | 'Trending' | 'Featured' | 'New' | 'Selling Fast';

export interface UserInteraction {
    id: string;
    userId: string;
    eventId?: string;
    action: 'click' | 'view' | 'book' | 'search' | 'bookmark';
    category?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    image: string;
    category: EventCategory;
    date: Date;
    time: string;
    duration: string; // e.g., "2 hours"
    location: string;
    locationName?: string;
    locationAddress?: string;
    latitude?: number;
    longitude?: number;
    coordinates?: Coordinates;
    price: number;
    capacity: number;
    registeredCount: number;
    organizerId: string;
    organizer: User;
    status: EventStatus;
    tags: string[];
    popularityScore: number;
    viewCount: number;
    isLiked?: boolean;
    eventSource: EventSource;
    externalId?: string;
    externalLink?: string;
    city?: string;
    videoUrl?: string;
    videoType?: string;
    eventType?: 'PHYSICAL' | 'ONLINE' | 'HYBRID';
    meetingLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SmartEvent extends Event {
    badges: EventBadge[];
    relevanceScore?: number;
}

export type RegistrationStatus =
    | 'registered'
    | 'attended'
    | 'cancelled'
    | 'waitlist';

export interface Registration {
    id: string;
    userId: string;
    eventId: string;
    status: RegistrationStatus;
    registeredAt: Date;
    attended: boolean;
    qrCode?: string;
    reminderSent: boolean;
}

export interface Review {
    id: string;
    userId: string;
    user: User;
    eventId: string;
    rating: number; // 1-5
    comment: string;
    createdAt: Date;
    helpfulCount: number;
}

export type BadgeRarity =
    | 'common'
    | 'rare'
    | 'epic'
    | 'legendary';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // registered icon name or url
    condition: string;
    rarity: BadgeRarity;
    earnedAt?: Date;
}

export interface FilterOptions {
    search?: string;
    categories?: EventCategory[];
    dateRange?: {
        start: Date | null;
        end: Date | null;
    };
    priceRange?: {
        min: number;
        max: number;
    };
    location?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
    sortBy?: 'date' | 'popularity' | 'price_low' | 'price_high';
}

export type NotificationType =
    | 'event_update'
    | 'reminder'
    | 'badge_earned'
    | 'registration_confirmation';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    eventId?: string;
    read: boolean;
    createdAt: Date;
}
