'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Mail, CalendarCheck, Ticket, Send, ArrowLeft, Loader2, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supportCards = [
    {
      icon: <HelpCircle className="w-6 h-6 text-primary" />,
      title: "General Help",
      description: "Need help setting up your account, editing profile data, or configuring preferences? Check our documentation.",
      email: "supportplus24x7@gmail.com",
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-[#ec4899]" />,
      title: "Event Hosting Help",
      description: "Questions regarding event permissions, custom covers, hybrid meeting sync, or check-in scanners?",
      email: "supportplus24x7@gmail.com",
    },
    {
      icon: <Ticket className="w-6 h-6 text-amber-500" />,
      title: "Ticket & Booking Help",
      description: "Issue with paid tickets checkout, PDF email generation, QR scanning, or ticket cancellation?",
      email: "supportplus24x7@gmail.com",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Message submitted successfully!");
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error("Failed to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        {/* Hero Header */}
        <div className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent dark:from-primary/20 dark:via-purple-500/10 dark:to-transparent" />
          <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Have questions? Get in touch with our team. We are here to support event goers and hosts around the clock.
            </p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Contact Form Column */}
            <div className="lg:col-span-2 bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-sm transition-all duration-300">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Send Us a Message</h2>
              
              {success ? (
                <div className="space-y-6 text-center py-10 animate-in fade-in zoom-in duration-300">
                  <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto">
                    <CheckCircle className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Message Sent!</h3>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                      Thanks for contacting CampusPulse. Our support team will get back to you soon.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/45"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        disabled={loading}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-6 px-4 text-sm font-medium text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@college.edu"
                        disabled={loading}
                        required
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-6 px-4 text-sm font-medium text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-auto"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Ticket Booking Error / Listing Vetting / General"
                      disabled={loading}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-6 px-4 text-sm font-medium text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-auto"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message Description</label>
                    <Textarea
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please provide as much detail as possible..."
                      disabled={loading}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 px-4 text-sm font-medium text-slate-950 dark:text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[150px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/95 text-white py-6 rounded-2xl font-bold transition-all border-none flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:scale-101"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Quick Contact Info Column */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Direct Support Email
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  For official inquiries, sponsor outreach, reporting guideline violations, or direct admin requests:
                </p>
                <a 
                  href="mailto:supportplus24x7@gmail.com" 
                  className="inline-block text-primary font-bold hover:underline text-sm font-mono break-all"
                >
                  supportplus24x7@gmail.com
                </a>
              </div>

              <div className="bg-secondary/40 border border-border rounded-3xl p-6 text-xs text-muted-foreground leading-relaxed">
                <p className="font-bold uppercase tracking-wider text-card-foreground mb-2">Response Times</p>
                <p>
                  Our ticketing queue operates 24x7. We prioritize urgent event cancellation and billing refund reports, which are usually answered in less than 2 hours. General platform inquiries are solved within 24 hours.
                </p>
              </div>
            </div>

          </div>

          {/* Quick Support Cards Grid */}
          <div className="space-y-6 border-t border-border pt-16">
            <h3 className="text-2xl font-bold tracking-tight text-center md:text-left">Support Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportCards.map((card, idx) => (
                <div key={idx} className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
                  <div className="space-y-4">
                    <div className="p-3 bg-secondary/85 rounded-2xl w-fit">
                      {card.icon}
                    </div>
                    <h4 className="text-lg font-bold text-card-foreground">{card.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-border/40">
                    <span className="text-xs text-muted-foreground font-semibold block">Email Support</span>
                    <a href={`mailto:${card.email}`} className="text-xs text-primary font-bold hover:underline font-mono">
                      {card.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
