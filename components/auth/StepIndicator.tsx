'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    labels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
    return (
        <div className="w-full">
            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-muted -z-10">
                    <motion.div
                        className="h-full bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: (currentStep - 1) / (totalSteps - 1) }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                {Array.from({ length: totalSteps }).map((_, i) => {
                    const stepNumber = i + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={i} className="flex flex-col items-center gap-2 bg-background">
                            <motion.div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                                    isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                        isCurrent ? "border-primary text-primary bg-background" :
                                            "border-muted text-muted-foreground bg-background"
                                )}
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.1 : 1,
                                }}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-semibold">{stepNumber}</span>}
                            </motion.div>
                            {labels && (
                                <span className={cn(
                                    "text-xs font-medium transition-colors",
                                    isCurrent ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {labels[i]}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
