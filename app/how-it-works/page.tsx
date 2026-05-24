import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Compass, Ticket, Mail, PlusCircle, LayoutDashboard, ArrowLeft, ChevronRight, Search, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: "How It Works - CampusPulse",
  description: "Learn how to find, attend, and host amazing events on the CampusPulse platform.",
};

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <Compass className="w-8 h-8 text-primary" />,
      title: "Discover Campus & Public Events",
      description: "Browse through an curated feed of concerts, workshops, seminars, and club activities happening near you. Filter by interest or search directly to find what moves you.",
    },
    {
      number: "02",
      icon: <Ticket className="w-8 h-8 text-primary" />,
      title: "Register & Book Tickets",
      description: "Secure your spot instantly. For paid events, ticketing is fast, secure, and hassle-free. For free events, registration takes just a single click.",
    },
    {
      number: "03",
      icon: <Mail className="w-8 h-8 text-primary" />,
      title: "Get Confirmation & Email Ticket",
      description: "Receive your PDF ticket via email immediately after registration. Show your ticket code at the entrance, and you are good to go!",
    },
  ];

  const hostSteps = [
    {
      number: "01",
      icon: <PlusCircle className="w-8 h-8 text-[#ec4899]" />,
      title: "Host Your Own Event",
      description: "Create an organizer account, set up your event page, add images, specify time, price, and venue details, and publish it instantly.",
    },
    {
      number: "02",
      icon: <LayoutDashboard className="w-8 h-8 text-[#ec4899]" />,
      title: "Manage from the Dashboard",
      description: "Track registrations, check attendee analytics, manage tickets, scan entrances on-site, and communicate updates to your guest list.",
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
              How CampusPulse Works
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Your gateway to college events. Find out how you can discover, attend, and host student and public activities with ease.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Attendee Flow */}
          <div className="space-y-10">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full">
                For Attendees & Guests
              </span>
              <h2 className="text-3xl font-bold mt-4 tracking-tight">Attending an Event in 3 Steps</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Discovering and attending events has never been simpler. Here is the breakdown:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-card border border-border hover:border-primary/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-105 transition-transform duration-300">
                        {step.icon}
                      </div>
                      <span className="text-4xl font-extrabold text-muted/30 select-none font-mono">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organizer Flow */}
          <div className="space-y-10 border-t border-border/60 pt-16">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-[#ec4899] uppercase tracking-widest bg-[#ec4899]/10 px-4 py-1.5 rounded-full">
                For Event Hosts & Organizers
              </span>
              <h2 className="text-3xl font-bold mt-4 tracking-tight">Host & Manage Activities</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Ready to bring your community together? Setup and customize your event inside our complete host toolkit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hostSteps.map((step, idx) => (
                <div key={idx} className="bg-card border border-border hover:border-[#ec4899]/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 items-start group">
                  <div className="p-3 bg-[#ec4899]/10 rounded-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-card-foreground group-hover:text-[#ec4899] transition-colors">
                        {step.title}
                      </h3>
                      <span className="text-2xl font-extrabold text-muted/30 select-none font-mono">
                        {step.number}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-[#ec4899]/10 rounded-3xl p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <h4 className="text-2xl font-bold mb-2">Ready to publish your first event?</h4>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Join hundreds of campus clubs, event organizers, and student boards. Make your next event unforgettable.
                </p>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 px-8 transition-transform hover:scale-105" asChild>
                <Link href="/create-event">Get Started</Link>
              </Button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
