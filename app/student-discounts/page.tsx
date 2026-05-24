import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { GraduationCap, Tag, Percent, School, Gift, ArrowLeft, Hourglass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: "Student Discounts - CampusPulse",
  description: "Get exclusive college student discounts, special event offers, and ticket price drops through CampusPulse verification.",
};

export default function StudentDiscounts() {
  const discounts = [
    {
      icon: <GraduationCap className="w-8 h-8 text-primary" />,
      title: "Student-Friendly Ticketing",
      description: "Any paid event hosted directly by official campus bodies or college departments comes with an automatic fee reduction, making it cheaper and more accessible for students.",
    },
    {
      icon: <Tag className="w-8 h-8 text-primary" />,
      title: "Discounted Ticket Categories",
      description: "Select custom event hosts offer 'Student Tier' passes. Simply select the student ticket option on check-out to purchase tickets at lower rates.",
    },
    {
      icon: <Percent className="w-8 h-8 text-primary" />,
      title: "Partnership Event Offers",
      description: "We partner with local tech hubs, concert organizers, and workshops outside campus to bring student-exclusive coupon codes directly to your inbox.",
    },
    {
      icon: <School className="w-8 h-8 text-primary" />,
      title: "Verification-Based Reductions",
      description: "By completing your Step 3 verification with your student email (.edu) or university credentials, you automatically unlock student prices on all participating events.",
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
              Student Discounts & Offers
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Unlock exclusive ticketing deals. Verify your student identity and attend events, workshops, and college fests at a fraction of the cost.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {discounts.map((discount, idx) => (
              <div key={idx} className="bg-card border border-border hover:border-primary/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex gap-6 items-start group">
                <div className="p-3 bg-primary/10 rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {discount.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                    {discount.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {discount.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Verification Callout */}
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-6">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <GraduationCap className="w-10 h-10 text-primary animate-bounce-slow" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Are you verified yet?</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Student accounts with verified university status gain automatic access to student discounts across the platform. Update your profile settings and add your college credentials now to unlock immediate discount benefits.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-transform hover:scale-105" asChild>
              <Link href="/dashboard">Go to Profile Dashboard</Link>
            </Button>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            <div className="relative z-10 space-y-4 md:w-2/3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Hourglass className="w-3.5 h-3.5 animate-spin-slow text-[#ec4899]" /> COMING SOON
              </span>
              <h4 className="text-2xl font-bold tracking-tight">The CampusPulse Perks Hub</h4>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                We are building direct integrations with popular software vendors, local cafes, bookshops, and coworking spaces to provide automatic, verified student benefits. Sign up, complete onboarding step 3, and stay tuned!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
