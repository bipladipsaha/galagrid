import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Manrope } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGRIMIND — AI Agriculture Operating System",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${manrope.variable} light`}
    >
      <body className="min-h-screen bg-[var(--gaia-bg-primary)] text-[var(--gaia-text-primary)] antialiased selection:bg-[var(--gaia-cyan)]/30 selection:text-[var(--gaia-green-800)]">
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-holographic-grid opacity-50" />
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[var(--gaia-green-500)]/5 blur-[120px] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[var(--gaia-cyan)]/10 blur-[100px] rounded-full mix-blend-multiply" />
        </div>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
