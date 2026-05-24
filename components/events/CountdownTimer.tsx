'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
    targetDate: Date;
    className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isExpired: boolean;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
                isExpired: false
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (timeLeft.isExpired) return null;

    return (
        <div className={cn("flex items-center gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl", className)}>
            <div className="bg-primary/20 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="flex gap-4">
                {timeLeft.days > 0 && (
                    <div className="text-center">
                        <div className="text-xl font-bold text-white leading-none">{timeLeft.days}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Days</div>
                    </div>
                )}
                <div className="text-center">
                    <div className="text-xl font-bold text-white leading-none">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Hrs</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold text-white leading-none">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Min</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold text-white leading-none text-primary">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Sec</div>
                </div>
            </div>
        </div>
    );
}
