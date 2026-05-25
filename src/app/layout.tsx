import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GaiaGrid — AI Agriculture Operating System",
  description:
    "AI-powered agricultural intelligence platform with crop disease detection, root cause analysis, chemical intelligence, IoT monitoring, and sustainability analytics.",
  keywords: [
    "AI agriculture",
    "crop disease detection",
    "root cause analysis",
    "smart farming",
    "precision agriculture",
    "sustainability",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#030806] text-[#e8f5e9] antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
