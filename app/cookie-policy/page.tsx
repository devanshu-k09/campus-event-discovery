import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ArrowLeft, Info, Cpu, Settings, Lock, Sliders, HelpCircle } from 'lucide-react';

export const metadata = {
  title: "Cookie Policy - CampusPulse",
  description: "Read the CampusPulse Cookie Policy to learn how we use cookies, tracking technologies, and how to manage your preferences.",
};

export default function CookiePolicy() {
  const lastUpdated = "May 22, 2026";

  const cookieSections = [
    {
      icon: <Info className="w-5 h-5 text-primary" />,
      title: "1. What Are Cookies?",
      content: "Cookies are small text files stored on your browser or device when you visit websites. They help keep you logged in, save local settings, and gather usage telemetry to ensure a smooth user experience.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-primary" />,
      title: "2. How We Use Cookies",
      content: "We use cookies to maintain your login sessions (via NextAuth), verify user roles, secure API requests, and load persistent options like light/dark mode theme configurations without needing to query the server repeatedly.",
    },
    {
      icon: <Settings className="w-5 h-5 text-primary" />,
      title: "3. Categories of Cookies We Set",
      content: "Essential Cookies: Necessary for security and basic features like authentication. Preference Cookies: Used to store visual themes and preferred cities. Analytical Cookies: Aggregate anonymous data regarding popular events and page loads to improve navigation.",
    },
    {
      icon: <Lock className="w-5 h-5 text-primary" />,
      title: "4. Third-Party Integrations",
      content: "We integrate Pusher for real-time chat, Google Maps for location autocomplete, and Auth adapters. These third-party services may set cookies on your browser to support their features, which are subject to their respective privacy policies.",
    },
    {
      icon: <Sliders className="w-5 h-5 text-primary" />,
      title: "5. Managing Cookie Preferences",
      content: "Most web browsers allow you to block or delete cookies via their settings panels. Note that disabling essential cookies will prevent you from signing in, hosting events, or registering for ticket codes.",
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      title: "6. Questions & Updates",
      content: "We may update this policy periodically to reflect changes in our operational procedures. For questions about cookies or tracking scripts, please reach out to us at supportplus24x7@gmail.com.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        {/* Header Hero */}
        <div className="relative overflow-hidden py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent dark:from-primary/20 dark:via-purple-500/10 dark:to-transparent" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-card-foreground">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-sm space-y-10">
            
            {/* Introductory text */}
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                At <strong>CampusPulse</strong>, we value transparency. This Cookie Policy explains how and why cookies and similar tracking mechanisms are utilized when you engage with our platform.
              </p>
              <p>
                By continuing to browse our campus events directory, you consent to our utilization of cookies in accordance with this policy.
              </p>
            </div>

            {/* Structured sections */}
            <div className="space-y-8 border-t border-border pt-10">
              {cookieSections.map((sec, idx) => (
                <div key={idx} className="space-y-3 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-105 transition-transform">
                      {sec.icon}
                    </div>
                    <h2 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {sec.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed pl-1">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="bg-secondary/40 rounded-2xl p-6 border border-border text-xs text-muted-foreground leading-relaxed space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-card-foreground">System Compatibility</h4>
              <p>
                Certain user configurations and browser extensions may alter how our site stores session cookies. Please check that your security tools do not block essential domain operations if you encounter sign-in issues.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
