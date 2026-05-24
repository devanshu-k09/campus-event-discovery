'use client';

import { useState } from 'react';
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Calendar, Ticket, TrendingUp } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { GoogleButton } from '@/components/auth/GoogleButton';

// Validation Schema
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
                rememberMe: data.rememberMe ? 'true' : 'false',
            });

            if (result?.error) {
                toast.error("Invalid credentials", {
                    description: "Please check your email and password and try again.",
                });
            } else {
                // Fetch the updated session to check the user role
                const res = await fetch('/api/auth/session');
                const session = await res.json();
                
                toast.success("Welcome back!", {
                    description: `Successfully logged in as ${session?.user?.name || 'User'}.`,
                });

                // Redirect based on role
                if (session?.user?.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/events');
                }
                router.refresh();
            }
        } catch (error) {
            toast.error("An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#f7f6f8] dark:bg-[#1d1022] font-display text-slate-900 dark:text-slate-100 overflow-hidden">

            {/* Left Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 lg:px-16 py-12 bg-white dark:bg-[#1d1022] relative z-10">
                <div className="max-w-md w-full">

                    {/* Logo */}
                    <div className="flex items-center justify-between mb-10">
                        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-10 h-10 bg-[#bd2bee] rounded-lg flex items-center justify-center shadow-lg shadow-[#bd2bee]/30 overflow-hidden relative">
                                <Calendar className="text-white w-6 h-6 relative z-10" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Event<span className="text-[#bd2bee]">Flow</span></span>
                        </Link>
                        <Link 
                            href="/admin/login" 
                            className="text-xs font-bold text-slate-400 hover:text-[#bd2bee] uppercase tracking-widest px-3 py-1.5 border border-slate-100 dark:border-slate-800 rounded-full transition-all"
                        >
                            Admin Portal
                        </Link>
                    </div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400">Log in to discover the latest events on campus.</p>
                    </motion.div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    {...register('email')}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-[#bd2bee]/20 focus:border-[#bd2bee] transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400`}
                                    id="email"
                                    placeholder="Enter your student email"
                                    type="email"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="password">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    {...register('password')}
                                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-[#bd2bee]/20 focus:border-[#bd2bee] transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400`}
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#bd2bee] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="border-slate-300 text-[#bd2bee] focus:ring-[#bd2bee] data-[state=checked]:bg-[#bd2bee] data-[state=checked]:border-[#bd2bee]" {...register('rememberMe')} />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer"
                                >
                                    Remember me
                                </label>
                            </div>
                            <Link className="text-sm font-semibold text-[#bd2bee] hover:text-[#bd2bee]/80 transition-colors" href="/forgot-password">Forgot password?</Link>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="w-full py-3.5 bg-gradient-to-r from-[#bd2bee] to-[#ff47d1] text-white rounded-lg font-bold text-base shadow-lg shadow-[#bd2bee]/25 hover:shadow-[#bd2bee]/40 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Logging In...
                                </>
                            ) : (
                                "Log In"
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="relative my-8"
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-[#1d1022] text-slate-500 dark:text-slate-400">Or continue with</span>
                        </div>
                    </motion.div>

                    {/* Social Login */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="w-full"
                    >
                        <GoogleButton />
                    </motion.div>

                    {/* Footer Sign Up */}
                    <div className="mt-10 text-center text-slate-600 dark:text-slate-400 text-sm">
                        Don't have an account?
                        <Link href="/signup" className="text-[#bd2bee] font-bold hover:underline ml-1">Sign up for free</Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Visual Hero */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#bd2bee] items-center justify-center p-12">
                {/* Dynamic Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#bd2bee] via-[#a320ce] to-[#f43f5e] opacity-90"></div>

                {/* Abstract Shapes */}
                <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"
                />
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-24 -mb-24"
                />

                <div className="relative z-10 w-full max-w-lg">
                    {/* Illustration Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-square mb-12 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
                    >
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkrzOFgBtfJKnSTVuhCgiToaMUiipE53o1zxov3t7sqJYvjgomOXNIcqdj0eS31TL8Cr3his6d1qxif7MeLTOebhk9XzjI5qBtMwXmsSRmyJ2_GDBcq3LLdXt8qN7yB-b-NIlaiWNqpcGRlqFbioz65sMWzc1AhqxvT_P9tD-WpUv0Fb85frWbAl3eEa2uR0wF2Trc3K6l9Hl5p92oy17PCo39MuEuR6efKbWsMh8-ONjmnwp-B1rSVKQKeu3vN0RRmP18rLKniyJD"
                            alt="Music Event"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Floating Glass UI Cards */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                                    <Ticket className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Ticket Confirmed!</p>
                                    <p className="text-white/70 text-xs">Campus Spring Fest 2024</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Floating Info Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 bg-white dark:bg-[#1d1022] p-4 rounded-xl shadow-xl flex items-center gap-3 shadow-[#bd2bee]/20"
                    >
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <TrendingUp className="text-green-600 w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">New Events</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">+24 Today</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="absolute top-1/2 -left-12 bg-white/90 dark:bg-[#1d1022]/90 backdrop-blur-sm p-4 rounded-xl shadow-xl max-w-[200px] border border-white/20"
                    >
                        <div className="flex -space-x-2 mb-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white relative overflow-hidden">
                                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" fill className="object-cover" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">+12</div>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">Your club members are attending!</p>
                    </motion.div>

                    {/* Text Content */}
                    <div className="text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-extrabold text-white mb-4 leading-tight"
                        >
                            Never miss a beat <br />on campus again.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/80 text-lg"
                        >
                            Join 10,000+ students discovering workshops, parties, and networking events every day.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div >
    );
}
