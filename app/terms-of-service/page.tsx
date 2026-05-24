import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { ArrowLeft, FileText, UserCheck, Calendar, Shield, AlertCircle, Scale } from 'lucide-react';

export const metadata = {
  title: "Terms of Service - CampusPulse",
  description: "Read the CampusPulse Terms of Service to understand your rights, responsibilities, and guidelines when using our platform.",
};

export default function TermsOfService() {
  const lastUpdated = "May 22, 2026";

  const termsSections = [
    {
      icon: <FileText className="w-5 h-5 text-primary" />,
      title: "1. Acceptance of Terms",
      content: "By creating an account, publishing events, purchasing/reserving tickets, or accessing the CampusPulse platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must not use or access the services.",
    },
    {
      icon: <UserCheck className="w-5 h-5 text-primary" />,
      title: "2. Account Registration and Security",
      content: "You must provide accurate and complete registration information, including your university affiliation, role, and official contact details. You are responsible for safeguarding your login credentials. Any unauthorized activity on your account must be reported to support immediately.",
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: "3. Event Organizing & Ticket Sales",
      content: "Organizers are solely responsible for the description, capacity, safety, and compliance of their events. CampusPulse acts as a facilitator and does not guarantee event quality or attendance. Tickets purchased through dynamic pricing algorithms are non-refundable unless specified otherwise by the organizer or in the event of cancellation.",
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "4. Acceptable Conduct & Use",
      content: "You agree not to publish illegal, defamatory, or harmful content. Events must comply with college/university administrative policies. We reserve the right to remove events, suspend accounts, and report violations to university administrators or local law enforcement if appropriate.",
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-primary" />,
      title: "5. Disclaimer of Warranties & Liability",
      content: "CampusPulse is provided on an 'as-is' and 'as-available' basis without warranties of any kind. We are not liable for direct, indirect, incidental, or consequential damages resulting from event cancellations, ticketing platform downtime, or attendee interactions.",
    },
    {
      icon: <Scale className="w-5 h-5 text-primary" />,
      title: "6. Governing Law & Disputes",
      content: "These terms shall be governed by and construed in accordance with the laws of the jurisdiction where the platform operates, without regard to its conflict of law principles. Any dispute arising from these terms will be settled in local arbitration courts.",
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
              Terms of Service
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
                Welcome to <strong>CampusPulse</strong>. These Terms of Service ('Terms') govern your use of our website, mobile application, and ticketing systems.
              </p>
              <p>
                Please read these terms carefully before utilizing our services. By accessing the platform, you represent that you have the capacity and authority to enter into these Terms of Service.
              </p>
            </div>

            {/* Structured sections */}
            <div className="space-y-8 border-t border-border pt-10">
              {termsSections.map((sec, idx) => (
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
              <h4 className="font-bold uppercase tracking-wider text-card-foreground">Contacting Support</h4>
              <p>
                For questions regarding event hosting, ticket issues, billing, or general queries, please contact our main team at supportplus24x7@gmail.com. We are committed to responding to standard support requests within 48 to 72 hours.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
