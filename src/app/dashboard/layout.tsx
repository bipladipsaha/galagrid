'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loginDemo } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Auto-login as demo user for development
    if (!isAuthenticated) {
      loginDemo('farmer');
    }
  }, [isAuthenticated, loginDemo]);

  return (
    <div className="flex min-h-screen bg-[var(--gaia-bg-primary)]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar />
        <main className="flex-1 overflow-auto pb-24 lg:pb-8 relative">
          {/* Subtle background glow for the dashboard */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--gaia-green-50)] blur-[120px] rounded-full pointer-events-none z-[-1]" />
          
          <div className="page-enter p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
