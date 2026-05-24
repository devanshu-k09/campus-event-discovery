import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Type, CalendarRange, Image, BadgePercent, UserCheck, ShieldX, FileSignature, ArrowLeft, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: "Host Guidelines - CampusPulse",
  description: "Read the CampusPulse event host guidelines to ensure high-quality listings, safety, and a premium experience for attendees.",
};

export default function HostGuidelines() {
  const coreGuidelines = [
    {
      icon: <Type className="w-6 h-6 text-primary" />,
      title: "1. Create Clear Event Titles & Info",
      description: "Use descriptive, engaging, and accurate titles. Avoid clickbait, all-caps strings, or spelling errors. In the description, outline what participants will learn or experience, who the speakers are, and who the event is intended for.",
    },
    {
      icon: <CalendarRange className="w-6 h-6 text-primary" />,
      title: "2. Specify Accurate Time & Venue",
      description: "Ensure the correct date, starting/ending time, and location venue details are selected. If the event is online, provide the correct meeting link (Zoom, Teams, etc.). For physical events, write clear instructions on room number or campus hall.",
    },
    {
      icon: <Image className="w-6 h-6 text-primary" />,
      title: "3. Upload Proper Cover Media",
      description: "Choose clean, high-resolution banners or cover posters representing your event. Avoid blurry images, text-heavy flyers that are unreadable on mobile screens, or copyrighted pictures that you do not own the rights to.",
    },
    {
      icon: <BadgePercent className="w-6 h-6 text-primary" />,
      title: "4. Clarify Refund & Cancellation Rules",
      description: "For paid ticket registrations, clearly specify the refund and cancellation policies in the details. Specify whether tickets are refundable, exchangeable, or non-refundable so that buyers have clear expectations prior to checkout.",
    },
    {
      icon: <ShieldX className="w-6 h-6 text-primary" />,
      title: "5. Zero Tolerance for Fake or Spam Events",
      description: "Do not publish test events, fake fests, phishing attempts, spam listings, or unconfirmed activities. Accounts attempting to host fake listings will be banned permanently and flagged in university logs.",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      title: "6. Respect Attendee Privacy",
      description: "Registered attendee list details (names, contact email, profile details) are provided solely for check-in verification and event-specific update notifications. Do not use this data for marketing outside of the event or share it with third parties.",
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
              Host Guidelines
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Help us build a vibrant, safe, and premium campus community. Follow these standards when creating and publishing your events.
            </p>
          </div>
        </div>

        {/* Guidelines List */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreGuidelines.map((guide, idx) => (
              <div key={idx} className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-2xl w-fit group-hover:scale-105 transition-transform duration-300">
                    {guide.icon}
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbulb callout */}
          <div className="bg-gradient-to-r from-primary/10 to-[#ec4899]/10 border border-primary/20 rounded-3xl p-8 md:p-12 shadow-sm flex items-start gap-6">
            <div className="bg-primary/20 p-3 rounded-full flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold">Pro-tip for successful events:</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Add an outline of your event timeline or agenda. Listing key times (e.g. 5:00 PM Doors Open, 5:30 PM Panel Discussion, 7:00 PM Networking) increases registration click-through rate by up to 45% and builds attendee confidence.
              </p>
            </div>
          </div>

          {/* Launch Section */}
          <div className="text-center pt-8">
            <h3 className="text-2xl font-bold mb-4">Aligned with our guidelines? Let's build.</h3>
            <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-transform hover:scale-105 px-8" asChild>
              <Link href="/create-event">Create Event Page</Link>
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
