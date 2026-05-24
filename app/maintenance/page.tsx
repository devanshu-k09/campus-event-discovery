'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wrench, RefreshCw } from "lucide-react";

export default function MaintenancePage() {
    const router = useRouter();
    const [message, setMessage] = useState("We are currently undergoing scheduled maintenance. Please check back in a few minutes.");
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        document.title = "Under Maintenance - CampusPulse";
        
        // Fetch current message
        fetch("/api/settings/maintenance")
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    setMessage(data.message);
                }
                // If maintenance is off, redirect immediately
                if (data.maintenanceMode === false) {
                    router.push("/");
                }
            })
            .catch(err => console.error(err));

        // Poll maintenance status every 5 seconds
        const intervalId = setInterval(() => {
            setIsChecking(true);
            fetch("/api/settings/maintenance")
                .then(res => res.json())
                .then(data => {
                    setIsChecking(false);
                    if (data.maintenanceMode === false) {
                        router.push("/");
                    }
                })
                .catch(err => {
                    setIsChecking(false);
                    console.error(err);
                });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [router]);

    return (
        <div 
            className="min-h-screen w-full flex items-center justify-center bg-[#f6f6f8] dark:bg-[#101122] font-display antialiased p-6 relative overflow-hidden"
            style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBB1J_Phsfw-GvQwg19q1GA8wvEyNTbfQwZIN3MxFOGxS73zyu3Z_XKf_GNOuUxI99arrDpCMDqmD73tDd3Rc3p_8VOeiVBDGXAYvigsQIq1a5VQ0arDGuL1HZdZKcHHsI1yMpQYXjXe5Ym0LPIiBVtr_pray5vgG33JRjEX5GOB1kDblk9L9_u8AWD3mujhce5BDu9kzqCuUoWJ5LmoQYSQ415-FupmgC5kJWARF-gPRCt1Sp3CY1VLUDRwcGkOpJcXuojdLNj3AWu')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            {/* Ambient Background Blur Overlay */}
            <div className="absolute inset-0 bg-[#f6f6f8]/80 dark:bg-[#101122]/90 backdrop-blur-[2px] pointer-events-none" />

            <div className="w-full max-w-[480px] relative z-10">
                <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                    
                    {/* Pulsing Animated Maintenance Icon Container */}
                    <div className="mb-6 relative">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center relative z-10">
                            <Wrench className="w-10 h-10 text-amber-500 animate-pulse" />
                        </div>
                        {/* Subtle decorative pulses */}
                        <motion.div
                            animate={{ scale: [1.1, 1.2, 1.1], opacity: [0.6, 0.9, 0.6] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-amber-500/20"
                        />
                        <motion.div
                            animate={{ scale: [1.25, 1.35, 1.25], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-amber-500/10"
                        />
                    </div>

                    {/* Content Section */}
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        Scheduled Maintenance
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm">
                        {message}
                    </p>

                    {/* Live Indicator Section */}
                    <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                            <span>Checking system status...</span>
                        </div>
                        <p className="text-[11px] text-slate-450 dark:text-slate-500">
                            This page will automatically refresh once the system is online.
                        </p>
                    </div>

                </div>

                {/* Support Text */}
                <p className="mt-8 text-center text-slate-500 dark:text-slate-550 text-sm">
                    Need urgent assistance? <a href="mailto:support@campuspulse.com" className="text-primary underline hover:opacity-80">Contact Support</a>
                </p>
            </div>

            {/* Hidden Image Data Section (Internal requirement fulfillment) */}
            <div className="hidden">
                <img 
                    data-alt="Soft abstract blue and purple gradient background" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB1J_Phsfw-GvQwg19q1GA8wvEyNTbfQwZIN3MxFOGxS73zyu3Z_XKf_GNOuUxI99arrDpCMDqmD73tDd3Rc3p_8VOeiVBDGXAYvigsQIq1a5VQ0arDGuL1HZdZKcHHsI1yMpQYXjXe5Ym0LPIiBVtr_pray5vgG33JRjEX5GOB1kDblk9L9_u8AWD3mujhce5BDu9kzqCuUoWJ5LmoQYSQ415-FupmgC5kJWARF-gPRCt1Sp3CY1VLUDRwcGkOpJcXuojdLNj3AWu"
                    alt="Soft abstract blue and purple gradient background"
                />
            </div>
        </div>
    );
}
