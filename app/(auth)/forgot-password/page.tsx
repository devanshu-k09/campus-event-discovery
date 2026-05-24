'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Forgot Password - CampusPulse";
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);

        try {
            // Simulate API request to send reset email
            await new Promise((resolve) => setTimeout(resolve, 1500));
            
            toast.success("Reset link sent!", {
                description: `A password reset link has been sent to ${data.email}.`,
            });
            
            router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            toast.error("Failed to send reset link", {
                description: "Please check your network connection and try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                    
                    {/* Icon Section */}
                    <div className="mb-6 relative">
                        <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center relative z-10">
                            <KeyRound className="w-10 h-10 text-primary" />
                        </div>
                        {/* Subtle decorative pulses */}
                        <motion.div
                            animate={{ scale: [1.1, 1.2, 1.1], opacity: [0.6, 0.9, 0.6] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary/20"
                        />
                        <motion.div
                            animate={{ scale: [1.25, 1.35, 1.25], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-primary/10"
                        />
                    </div>

                    {/* Content Section */}
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        Forgot Password?
                    </h1>
                    <p className="text-slate-650 dark:text-slate-400 mb-8 leading-relaxed text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {/* Forgot Password Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    {...register('email')}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-850 border ${errors.email ? 'border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary/20'} rounded-xl focus:ring-2 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-sm`}
                                    id="email"
                                    placeholder="Enter your student email"
                                    type="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-rose-500 text-xs font-bold mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            className={`w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/25 text-sm flex items-center justify-center gap-2 ${
                                isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
                            }`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>

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

                {/* Support Text */}
                <p className="mt-8 text-center text-slate-500 dark:text-slate-550 text-sm">
                    Remember your password? <Link href="/login" className="text-primary underline hover:opacity-80">Log In</Link>
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
