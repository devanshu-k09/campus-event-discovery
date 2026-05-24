import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ArrowLeft, Shield, Mail, Database, UserMinus, ShieldAlert, FileText } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy - CampusPulse",
  description: "Read the CampusPulse Privacy Policy to understand what data we collect, how we use it, and how we protect your privacy.",
};

export default function PrivacyPolicy() {
  const lastUpdated = "May 22, 2026";

  const policySections = [
    {
      icon: <Database className="w-5 h-5 text-primary" />,
      title: "1. What Data CampusPulse Collects",
      content: "We collect information you provide directly during registration, profile creation, and event creation or ticket booking. This includes your name, email address, password hash, role designation (Student, Faculty, Organiser, etc.), college/university, department, year, profile images, and event preference categories. For paid transactions, billing data is processed by encrypted third-party payment gateways; we do not store full credit card credentials.",
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "2. How User Data is Used",
      content: "Your data is used to customize your event discovery feed, compile organizer lists, display public profiles to fellow attendees, send platform recommendations, prevent fraudulent accounts, verify host roles, and improve platform performance. We compile anonymized analytics metrics to help event hosts understand aggregate registration distributions.",
    },
    {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: "3. Email Usage for Ticket Confirmation",
      content: "When you book a ticket or register for an event, we generate a PDF ticket containing a cryptographically signed check-in code and send it directly to your registered email address. Hosts are also provided your contact email to send urgent scheduling updates, venue changes, or cancellation warnings regarding that specific event. We do not sell or lease email lists for spam marketing.",
    },
    {
      icon: <FileText className="w-5 h-5 text-primary" />,
      title: "4. Profile Data Privacy Control",
      content: "By default, your profile name, user type, and selected college are visible to event hosts of activities you register for to allow entrance verification. You can update, customize, or hide personal parameters directly inside your profile settings dashboard. Public profiles do not show sensitive access tokens or account log files.",
    },
    {
      icon: <UserMinus className="w-5 h-5 text-primary" />,
      title: "5. Account Deletion & Data Retention",
      content: "You have the right to delete your CampusPulse account at any time. When you select Account Deletion inside your settings dashboard, we erase your profile fields, active event registrations, ticket records, and authentication keys from our production database within 30 days. Logged analytical events are anonymized to remove personal identifiers.",
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
      title: "6. Privacy Concerns & Inquiries",
      content: "If you have questions about this policy, data retention schedules, or believe your data security has been compromised, please contact our Data Protection Officer at supportplus24x7@gmail.com. We respond to all inquiry requests within 72 hours.",
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
              Privacy Policy
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
                At <strong>CampusPulse</strong>, we are committed to safeguarding your privacy and protecting the personal data you share with us. This Privacy Policy details the types of information we collect, how it is stored and processed, and your rights concerning your personal information on our event discovery platform.
              </p>
              <p>
                By using CampusPulse, creating an organizer profile, registering for tickets, or browsing our campus events feed, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {/* Structured sections */}
            <div className="space-y-8 border-t border-border pt-10">
              {policySections.map((sec, idx) => (
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
              <h4 className="font-bold uppercase tracking-wider text-card-foreground">Regulatory compliance</h4>
              <p>
                Our data processing systems are designed to incorporate privacy-by-design standards. We align our data collection workflows to comply with regional regulations governing electronic communications and personal information privacy.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
