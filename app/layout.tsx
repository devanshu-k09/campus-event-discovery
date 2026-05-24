import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusPulse - Discover Amazing Campus Events",
  description: "Connect with your community. Find what moves you this semester.",
};

import { cn } from "@/lib/utils";
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { headers, cookies } from "next/headers";
import { getSystemSettings } from "@/app/actions/settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";

  // Check maintenance settings from local settings.json using server-side fs (via getSystemSettings)
  const settings = await getSystemSettings();
  const cookieStore = await cookies();
  
  if (settings.maintenanceMode) {
    const session = await getServerSession(authOptions);
    const isAdminUser = session?.user?.role === "admin";
    const isAdminRoute = pathname.startsWith("/admin");
    const isMaintenancePage = pathname === "/maintenance";

    if (!isAdminRoute && !isMaintenancePage && !isAdminUser) {
      // Set the maintenance_mode cookie so middleware can block subsequent routes
      cookieStore.set("maintenance_mode", "true", { path: "/" });
      redirect("/maintenance");
    }
  } else {
    // If maintenance mode is off, clear the cookie if it was set
    if (cookieStore.get("maintenance_mode")?.value === "true") {
      cookieStore.set("maintenance_mode", "false", { path: "/" });
    }
    // If they are on the maintenance page, redirect to home page
    if (pathname === "/maintenance") {
      redirect("/");
    }
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          "antialiased font-sans"
        )} 
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
