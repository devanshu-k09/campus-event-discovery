'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  user: { name: string | null; email: string };
  event: { title: string; category: string };
  priceAtBooking: any;
}

interface ExportCSVButtonProps {
  data: Booking[];
}

export function ExportCSVButton({ data }: ExportCSVButtonProps) {
  const handleExport = () => {
    // CSV Header
    const headers = ['Transaction ID', 'Customer Name', 'Customer Email', 'Event Title', 'Category', 'Amount'];
    
    // Convert data to CSV rows
    const rows = data.map(booking => [
      `TXN-${booking.id.substring(0, 8).toUpperCase()}`,
      `"${booking.user.name || 'Unknown'}"`,
      `"${booking.user.email}"`,
      `"${booking.event.title}"`,
      `"${booking.event.category}"`,
      booking.priceAtBooking.toString()
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}
