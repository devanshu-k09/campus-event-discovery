'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Search, Ticket, Calendar, XCircle, MessageSquare, HelpCircle, ArrowLeft, ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    {
      icon: <Ticket className="w-6 h-6 text-primary" />,
      title: "Ticketing & Booking",
      description: "How to register, view ticket PDFs, transfer spots, or handle paid checkout.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-[#ec4899]" />,
      title: "Event Hosting",
      description: "Steps to publish events, track analytics, verify entries, or edit descriptions.",
    },
    {
      icon: <XCircle className="w-6 h-6 text-amber-500" />,
      title: "Cancellations & Refunds",
      description: "Guidelines on cancellation requests, ticket refunds, and timeline policies.",
    },
  ];

  const faqs = [
    {
      question: "How do I register for an event?",
      answer: "Discover an event in our main feed, click on its card to open the details page, select the quantity of tickets, and click the 'Register' or 'Book Ticket' button. If the event is paid, complete the secure payment process. You will instantly receive a confirmation email containing your PDF ticket and QR code.",
      category: "Ticketing & Booking"
    },
    {
      question: "How can I host my own event on CampusPulse?",
      answer: "Sign up or log in, then click the 'Host an Event' button in the navigation header or head directly to '/create-event'. Enter the event title, date, time, select whether it's online, offline, or hybrid, upload a high-quality cover photo, write the description, define ticket pricing, and click publish. You can manage registrations directly from your organizer dashboard.",
      category: "Event Hosting"
    },
    {
      question: "How do I cancel my registration for an event?",
      answer: "Go to your dashboard, select the 'My Events' or 'Tickets' section, locate the ticket registration you wish to cancel, click on it to view details, and select 'Cancel Registration'. Confirm the cancellation in the popup modal. If it was a paid ticket, refunds are processed according to the host's cancellation policy.",
      category: "Cancellations & Refunds"
    },
    {
      question: "Is there a fee for hosting free events?",
      answer: "No, hosting free events on CampusPulse is completely free of charge. You get full access to the organizer dashboard, attendee registration records, ticketing emails, and on-site entrance verification at absolutely zero cost.",
      category: "Event Hosting"
    },
    {
      question: "How do I contact customer support if I run into issues?",
      answer: "You can reach our dedicated support desk by visiting our '/contact-us' page and filling out the support ticket form, or by sending an email directly to supportplus24x7@gmail.com. We are online 24/7 and usually respond within a couple of hours.",
      category: "General"
    },
    {
      question: "Can anyone attend events hosted on the platform?",
      answer: "Yes, while CampusPulse is optimized for university life, we support public activities, guest events, and alumni meetups. Check the event details page to see if there are any specific guidelines or restrictions (e.g. valid student ID required) set by the host.",
      category: "Ticketing & Booking"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Help Center
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Find answers, guidelines, and troubleshooting tips to make your CampusPulse experience seamless.
            </p>
            
            {/* Interactive Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search FAQs, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-6 bg-card border-border rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <div className="p-3 bg-secondary/85 rounded-2xl w-fit mb-6">
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-card-foreground mb-2">{cat.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{cat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-center md:text-left">Frequently Asked Questions</h2>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, idx) => (
                  <div 
                    key={idx} 
                    className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-card-foreground hover:bg-muted/30 transition-colors"
                    >
                      <span className="pr-4">{faq.question}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === idx && (
                      <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300 border-t border-border/40 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-card border border-border rounded-2xl space-y-4">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                <h4 className="text-lg font-bold">No results found</h4>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  We could not find any answers matching "{searchQuery}". Please try using other terms or contact our support team.
                </p>
              </div>
            )}
          </div>

          {/* Contact Support Banner */}
          <div className="bg-gradient-to-r from-primary/10 to-[#ec4899]/10 border border-primary/20 rounded-[2rem] p-8 md:p-12 text-center max-w-4xl mx-auto space-y-6">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
              <LifeBuoy className="w-8 h-8 text-primary animate-spin-slow" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">Still need support?</h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Our campus relations team and support engineers are available round-the-clock to assist you with registration refunds, event errors, or account issues.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button size="lg" className="bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-transform hover:scale-105" asChild>
                <Link href="/contact-us">Open Contact Form</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
