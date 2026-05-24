import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Check, Sparkles, Zap, ArrowLeft, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: "Pricing Plans - CampusPulse",
  description: "Explore CampusPulse pricing: Free for attendees and organizers of free events. Industry-lowest rates for paid events.",
};

export default function Pricing() {
  const plans = [
    {
      name: "Attendee",
      tagline: "For discovering and booking events",
      price: "$0",
      period: "free forever",
      color: "border-border",
      buttonText: "Create Account",
      buttonHref: "/signup",
      buttonVariant: "outline" as const,
      features: [
        "Create a free user account",
        "Unlimited event discovery",
        "Free ticket bookings",
        "Receive PDF tickets by email",
        "Access history from dashboard",
        "Basic notification alerts",
      ],
      isPopular: false,
    },
    {
      name: "Standard Organizer",
      tagline: "For clubs and hosting free events",
      price: "$0",
      period: "free forever",
      color: "border-primary shadow-lg shadow-primary/10 relative",
      buttonText: "Start Hosting",
      buttonHref: "/create-event",
      buttonVariant: "default" as const,
      features: [
        "Host unlimited free events",
        "Complete organizer dashboard",
        "Attendee list registrations",
        "PDF ticket distribution",
        "General verification badge",
        "Standard support channels",
      ],
      isPopular: true,
    },
    {
      name: "Pro Ticketing",
      tagline: "For selling paid tickets",
      price: "2.5%",
      period: "per paid ticket + $0.50",
      color: "border-border",
      buttonText: "Contact Sales",
      buttonHref: "/contact-us",
      buttonVariant: "outline" as const,
      features: [
        "Sell paid tickets",
        "Secure payments integration",
        "Custom discount promo codes",
        "Live check-in entry scanning",
        "Attendee messaging system",
        "Priority 24/7 support",
      ],
      isPopular: false,
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              CampusPulse is built to connect communities. It is completely free to attend events, host free events, or discover local happenings.
            </p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-card border rounded-[2rem] p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 ${plan.color}`}
              >
                <div>
                  {plan.isPopular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-[#8b5cf6] text-white px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">
                      Highly Recommended
                    </span>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-card-foreground">{plan.name}</h3>
                    <p className="text-muted-foreground text-xs mt-1 font-medium">{plan.tagline}</p>
                  </div>
                  <div className="flex items-baseline mb-8">
                    <span className="text-4xl md:text-5xl font-black tracking-tight">{plan.price}</span>
                    <span className="text-muted-foreground text-sm font-semibold ml-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  size="lg" 
                  variant={plan.buttonVariant}
                  className={`w-full rounded-2xl font-bold transition-all py-6 ${
                    plan.buttonVariant === 'default' 
                      ? 'bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 hover:scale-102' 
                      : 'hover:bg-primary/5 hover:text-primary hover:border-primary/50'
                  }`}
                  asChild
                >
                  <Link href={plan.buttonHref}>{plan.buttonText}</Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Premium Coming Soon Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-[#ec4899]/10 border border-primary/20 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Coming Soon
              </span>
              <h4 className="text-2xl font-bold tracking-tight">Premium Organizer Tools</h4>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                We are developing custom email campaigns, custom event domains, in-depth AI insights, automated analytics dashboard, and priority home page banner spots. Stay tuned!
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button size="lg" className="bg-[#0f172a] hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-50 dark:text-black text-white font-bold rounded-2xl px-6 transition-transform hover:scale-105 border-none" asChild>
                <Link href="/contact-us">Request Early Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
