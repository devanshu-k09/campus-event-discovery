'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, Facebook, Instagram, Twitter, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export function Footer() {
    const { data: session } = useSession();
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            toast.error("Please enter your email address");
            return;
        }

        // Basic email regex client side validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: trimmedEmail }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "You have successfully subscribed to CampusPulse updates.");
                setEmail('');
            } else {
                toast.error(data.error || "Subscription failed. Please try again.");
            }
        } catch (err) {
            console.error("Newsletter submission error:", err);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className="bg-[#0f172a] text-white pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <CalendarCheck className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Campus<span className="text-primary">Pulse</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            The ultimate discovery platform for the next generation of college students. Built by students, for students.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Coming soon!"); }} className="text-slate-400 hover:text-primary transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
                            <a href="mailto:supportplus24x7@gmail.com" className="text-slate-400 hover:text-primary transition-colors" aria-label="Email"><Mail className="w-5 h-5" /></a>
                            <a href="https://www.instagram.com/devanshukukade" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
                            <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Coming soon!"); }} className="text-slate-400 hover:text-primary transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h6 className="font-bold mb-6 text-white text-base">Platform</h6>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
                            <li><Link href="/safety-trust" className="hover:text-primary transition-colors">Safety & Trust</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/student-discounts" className="hover:text-primary transition-colors">Student Discounts</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h6 className="font-bold mb-6 text-white text-base">Support</h6>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/host-guidelines" className="hover:text-primary transition-colors">Host Guidelines</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h6 className="font-bold mb-6 text-white text-base">Join the Loop</h6>
                        <p className="text-sm text-slate-400 mb-4">Get weekly updates on the coolest events happening on campus.</p>
                        <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
                            <div className="relative">
                                <Input
                                    className="w-full bg-slate-800 border-none rounded-lg text-sm px-4 py-3 text-white focus:ring-2 focus:ring-primary placeholder:text-slate-500 h-auto"
                                    placeholder="Email address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={submitting}
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-lg font-bold transition-all border-none flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    "Subscribe Now"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 CampusPulse Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
                        <Link 
                            href={session?.user?.role === 'admin' ? '/admin/dashboard' : '/admin/login'} 
                            className="hover:text-white transition-colors font-bold text-slate-400 animate-pulse-slow"
                        >
                            Admin Access
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
