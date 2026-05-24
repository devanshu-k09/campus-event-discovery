'use client';

import { useState } from 'react';
import { 
    Zap, TrendingUp, Clock, AlertCircle, 
    ArrowUpRight, Info, IndianRupee, Minus, Plus 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SmartPricingSectionProps {
    enabled: boolean;
    onEnabledChange: (v: boolean) => void;
    minPrice: number;
    maxPrice: number;
    onMinPriceChange: (v: number) => void;
    onMaxPriceChange: (v: number) => void;
    thresholds: any[];
    onThresholdsChange: (v: any[]) => void;
    timeRule: any;
    onTimeRuleChange: (v: any) => void;
}

export function SmartPricingSection({
    enabled,
    onEnabledChange,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    thresholds,
    onThresholdsChange,
    timeRule,
    onTimeRuleChange
}: SmartPricingSectionProps) {

    const addThreshold = () => {
        onThresholdsChange([...thresholds, { seatsFilled: 50, increase: 10 }]);
    };

    const removeThreshold = (index: number) => {
        onThresholdsChange(thresholds.filter((_, i) => i !== index));
    };

    const updateThreshold = (index: number, field: string, value: number) => {
        const newThresholds = [...thresholds];
        newThresholds[index] = { ...newThresholds[index], [field]: value };
        onThresholdsChange(newThresholds);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/10 rounded-2xl shadow-inner shadow-amber-500/5">
                        <Zap className="text-amber-500 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Smart <span className="text-amber-500 italic">Pricing</span></h2>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-0.5">Maximize engagement with dynamic demand rules</p>
                    </div>
                </div>
                <Switch 
                    checked={enabled} 
                    onCheckedChange={onEnabledChange}
                    className="data-[state=checked]:bg-amber-500"
                />
            </div>

            {enabled && (
                <div className="bg-amber-50/30 dark:bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-200/40 dark:border-amber-500/10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    
                    {/* Price Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Price (₹)</Label>
                            <div className="relative group/input">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
                                <Input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => onMinPriceChange(Number(e.target.value))}
                                    className="pl-11 h-14 bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-amber-500/10 transition-all font-bold text-sm shadow-inner"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Maximum Price (₹)</Label>
                            <div className="relative group/input">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within/input:text-amber-500 transition-colors" />
                                <Input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                                    className="pl-11 h-14 bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-amber-500/10 transition-all font-bold text-sm shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-amber-200/40 dark:bg-amber-500/10" />

                    {/* Occupancy Rules */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Demand-Based Thresholds</h3>
                            </div>
                            <Button 
                                type="button"
                                variant="ghost" 
                                size="sm" 
                                onClick={addThreshold}
                                className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-500/10"
                            >
                                <Plus className="w-3 h-3 mr-1.5" />
                                Add Rule
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {thresholds.map((t, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm group">
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase shrink-0">If seats filled &gt;</span>
                                        <Input 
                                            type="number" 
                                            value={t.seatsFilled} 
                                            onChange={(e) => updateThreshold(i, 'seatsFilled', Number(e.target.value))}
                                            className="h-9 w-20 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-center font-bold text-sm"
                                        />
                                        <span className="text-[10px] font-black text-slate-400 uppercase">%</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                                    <div className="flex-1 flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase shrink-0">Increase price by</span>
                                        <Input 
                                            type="number" 
                                            value={t.increase} 
                                            onChange={(e) => updateThreshold(i, 'increase', Number(e.target.value))}
                                            className="h-9 w-20 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-center font-bold text-sm text-amber-600"
                                        />
                                        <span className="text-[10px] font-black text-slate-400 uppercase">%</span>
                                    </div>
                                    <Button 
                                        type="button"
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeThreshold(i)}
                                        className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {thresholds.length === 0 && (
                                <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest py-4 border-2 border-dashed border-amber-200/40 dark:border-amber-500/10 rounded-2xl">
                                    No demand rules set. Price will remain stable.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Time Rule */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Time-Based Urgency</h3>
                        </div>
                        <div className="p-6 bg-amber-500/5 dark:bg-amber-500/10 rounded-[2rem] border border-amber-200/50 dark:border-amber-500/20 relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                                <div className="flex-1 space-y-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Urgency Window (Hours before)</span>
                                    <Input 
                                        type="number" 
                                        value={timeRule?.lastHours || 24} 
                                        onChange={(e) => onTimeRuleChange({ ...timeRule, lastHours: Number(e.target.value) })}
                                        className="h-12 bg-white dark:bg-slate-950 border-none rounded-xl font-bold text-sm"
                                        placeholder="e.g., 24"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price Boost (%)</span>
                                    <Input 
                                        type="number" 
                                        value={timeRule?.increase || 20} 
                                        onChange={(e) => onTimeRuleChange({ ...timeRule, increase: Number(e.target.value) })}
                                        className="h-12 bg-white dark:bg-slate-950 border-none rounded-xl font-bold text-sm text-amber-600"
                                        placeholder="e.g., 20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-950/50 p-6 rounded-[2rem] border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                            <Info className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">How it works</h4>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                                The system will calculate the final price by summing the base price + all applicable occupancy and time-based boosts. 
                                The final price will never exceed your Maximum Price or fall below your Minimum Price.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
