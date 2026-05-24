'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface PasswordStrengthProps {
    password?: string;
}

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        let score = 0;
        if (!password) {
            setStrength(0);
            return;
        }

        if (password.length > 5) score += 1;
        if (password.length > 7) score += 1;
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        setStrength(score);
    }, [password]);

    const getColor = (index: number) => {
        if (strength === 0) return 'bg-muted';
        if (strength < 2) return index < 1 ? 'bg-red-500' : 'bg-muted';
        if (strength < 3) return index < 2 ? 'bg-yellow-500' : 'bg-muted';
        return index < strength ? 'bg-green-500' : 'bg-muted';
    };

    const getLabel = () => {
        if (strength === 0) return 'Enter password';
        if (strength < 2) return 'Weak';
        if (strength < 3) return 'Medium';
        if (strength < 4) return 'Strong';
        return 'Very Strong';
    };

    return (
        <div className="space-y-1.5">
            <div className="flex gap-1.5 h-1.5 overflow-hidden rounded-full bg-muted/30">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={cn("h-full flex-1 transition-all duration-500", getColor(i))}
                    />
                ))}
            </div>
            <p className="text-xs text-muted-foreground text-right font-medium">
                {password && getLabel()}
            </p>
        </div>
    );
}
