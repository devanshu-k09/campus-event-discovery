import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ShieldCheck, Lock, ShieldAlert, FileText, HeartHandshake, ArrowLeft, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: "Safety & Trust - CampusPulse",
  description: "Learn about how CampusPulse prioritizes safety, trust, verification, and security for our community.",
};

export default function SafetyTrust() {
  const securityPillars = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Verified Event Hosts",
      description: "We verify event organizers and student leaders through email verification, student portal sync, and administrative vetting. Fake or copycat accounts are immediately filtered out.",
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Secure User Accounts",
      description: "Your account is protected using next-generation encryption protocols and optional Multi-Factor Authentication. We secure sessions and actively monitor account activities for suspicious actions.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Safe Ticket Booking",
      description: "All transactions are fully encrypted. Tickets are signed cryptographically, meaning they cannot be forged or counterfeited. Seamless refunds and strict verification guidelines keep your capital safe.",
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-primary" />,
      title: "Event Reporting System",
      description: "Spotted something suspicious or inappropriate? Any user can report an event instantly. Our admin moderation team reviews reports 24/7 and suspends violating hosts.",
    },
    {
      icon: <Eye className="w-8 h-8 text-primary" />,
      title: "Privacy-First Data Handling",
      description: "We never sell your personal information or profile activity. Your contact details are only shared with hosts whose events you register for, specifically for check-in and updates.",
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-primary" />,
      title: "Community Guidelines",
      description: "We enforce strict guidelines that promote inclusivity, respect, and diversity. Harassment, hate speech, or dangerous activities have zero place on CampusPulse.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent dark:from-primary/20 dark:via-purple-500/10 dark:to-transparent" />
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
              Safety & Trust
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We design our features to ensure that every event is secure, every organizer is authentic, and your data remains private.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityPillars.map((pillar, idx) => (
              <div key={idx} className="bg-card border border-border hover:border-primary/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:scale-105 transition-transform duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Reporting Section */}
          <div className="mt-16 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-2/3 space-y-4">
              <h3 className="text-2xl font-bold tracking-tight">Need to report an event or security concern?</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                If you encounter any misleading event descriptions, spam, guidelines violations, or potential vulnerability issues, please contact our response team. We take immediate action to protect our campus community.
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-col sm:flex-row gap-4 w-full justify-end">
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-transform hover:scale-105 text-sm" asChild>
                <Link href="/contact-us">Report Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
