import { differenceInHours } from 'date-fns';

export interface PricingThreshold {
    seatsFilled: number; // percentage
    increase: number;    // percentage
}

export interface TimeRule {
    lastHours: number;
    increase: number; // percentage
}

export interface PricingConfig {
    enabled: boolean;
    basePrice: number;
    minPrice?: number;
    maxPrice?: number;
    thresholds?: PricingThreshold[];
    timeRules?: TimeRule;
}

export function calculateCurrentPrice(event: any) {
    if (!event.dynamicPricingEnabled) {
        return {
            currentPrice: Number(event.price),
            label: null,
            urgency: 'low',
            reason: 'Standard Pricing'
        };
    }

    let finalPrice = Number(event.price);
    const totalCapacity = event.capacity;
    const registeredCount = event.registeredCount || 0;
    const occupancyRate = (registeredCount / totalCapacity) * 100;
    const hoursLeft = differenceInHours(new Date(event.date), new Date());

    let label = null;
    let urgency = 'low';
    let reason = 'Base Price';

    // 1. Occupancy Thresholds
    if (event.priceThresholds && Array.isArray(event.priceThresholds)) {
        const sortedThresholds = [...event.priceThresholds].sort((a, b) => b.seatsFilled - a.seatsFilled);
        const activeThreshold = sortedThresholds.find(t => occupancyRate >= t.seatsFilled);
        
        if (activeThreshold) {
            finalPrice += Number(event.price) * (activeThreshold.increase / 100);
            label = "High Demand";
            urgency = occupancyRate > 90 ? 'critical' : 'high';
            reason = `Occupancy at ${occupancyRate.toFixed(0)}%`;
        }
    }

    // 2. Time-based Rules
    if (event.timeBasedIncrease) {
        const timeRule = event.timeBasedIncrease as any;
        if (hoursLeft > 0 && hoursLeft <= timeRule.lastHours) {
            const timeIncrease = Number(event.price) * (timeRule.increase / 100);
            finalPrice += timeIncrease;
            label = hoursLeft <= 24 ? "Flash Sale Ending" : "Last Minute Price";
            urgency = 'high';
            reason = `Event starts in ${hoursLeft} hours`;
        }
    }

    // 3. Early Bird (If occupancy is very low and time is far)
    if (occupancyRate < 10 && hoursLeft > 72 && !label) {
        // Optional logic for automatic early bird if not explicitly set
        // But let's stick to the rules provided
    }

    // Urgency Cues
    if (totalCapacity - registeredCount <= 5) {
        label = "⚡ Last 5 Tickets";
        urgency = 'critical';
    } else if (occupancyRate > 80) {
        label = "🔥 Selling Fast";
        urgency = 'high';
    }

    // Clamping
    if (event.minPrice && finalPrice < Number(event.minPrice)) finalPrice = Number(event.minPrice);
    if (event.maxPrice && finalPrice > Number(event.maxPrice)) finalPrice = Number(event.maxPrice);

    return {
        currentPrice: Math.round(finalPrice),
        label,
        urgency,
        reason,
        occupancyRate,
        seatsLeft: totalCapacity - registeredCount
    };
}
