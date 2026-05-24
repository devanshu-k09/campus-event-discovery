'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';

function CheckEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'student.alex@university.edu';
    
    const [timeLeft, setTimeLeft] = useState(59);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        document.title = "Check Your Email - CampusPulse";
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleResend = () => {
        setTimeLeft(59);
        setCanResend(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center relative z-10 w-full">

            {/* Icon Section */}
            <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-full bg-[#f0fdf4] dark:bg-green-950/30 flex items-center justify-center relative z-10">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                </div>
                {/* Subtle decorative pulses */}
                <motion.div
                    animate={{ scale: [1.1, 1.2, 1.1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-500/20"
                />
                <motion.div
                    animate={{ scale: [1.25, 1.35, 1.25], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute inset-0 w-20 h-20 rounded-full border-4 border-green-500/10"
                />
            </div>

            {/* Content Section */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Check your email
            </h1>
            <p className="text-slate-650 dark:text-slate-400 mb-8 leading-relaxed text-sm">
                We've sent a password reset link to <br />
                <span className="font-semibold text-slate-900 dark:text-white">{email}</span>. <br />
                Please check your inbox and follow the instructions.
            </p>

            {/* Timer / Resend Section */}
            <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-450 mb-4">
                    Didn't receive the email?
                </p>

                {/* Countdown Display */}
                {!canResend && (
                    <div className="flex items-center justify-center space-x-2 text-sm font-medium text-slate-400 mb-4">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>You can resend in {formatTime(timeLeft)}</span>
                    </div>
                )}

                {/* Resend Button */}
                <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all text-sm ${
                        canResend
                            ? "bg-primary text-white hover:opacity-90 shadow-md shadow-primary/25 cursor-pointer"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
                    disabled={!canResend}
                    onClick={handleResend}
                >
                    Resend Link
                </button>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-8">
                <Link
                    href="/login"
                    className="inline-flex items-center text-primary font-semibold hover:opacity-80 transition-all text-sm group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to login
                </Link>
            </div>
        </div>
    );
}

export default function CheckEmailPage() {
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

            <div className="w-full max-w-[400px] relative z-10">
                <Suspense fallback={
                    <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center animate-pulse w-full">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6" />
                        <div className="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded mb-3" />
                        <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded mb-8" />
                        <div className="h-10 w-full bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                }>
                    <CheckEmailContent />
                </Suspense>

                {/* Support Text */}
                <p className="mt-8 text-center text-slate-500 dark:text-slate-500 text-sm">
                    Still having trouble? <a href="#" className="text-primary underline hover:opacity-80">Contact Support</a>
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
