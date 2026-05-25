'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  Brain,
  FlaskConical,
  MessageSquare,
  Activity,
  Settings,
  Shield,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/scanner', label: 'AI Scanner', icon: ScanLine },
  { href: '/dashboard/analysis', label: 'Root Cause', icon: Brain },
  { href: '/dashboard/chemicals', label: 'Chemicals', icon: FlaskConical },
  { href: '/dashboard/assistant', label: 'AI Assistant', icon: MessageSquare },
  { href: '/dashboard/sensors', label: 'Sensors', icon: Activity },
  { href: '/dashboard/admin', label: 'Admin', icon: Shield },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loginDemo } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Auto-login as demo user for development
    if (!isAuthenticated) {
      loginDemo('farmer');
    }
  }, [isAuthenticated, loginDemo]);

  return (
    <div className="flex min-h-screen bg-[#030806]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#050a07] border-r border-[rgba(0,255,136,0.08)]">
          <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgba(0,255,136,0.08)]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#030806]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#e8f5e9]">
                Gaia<span className="text-[#00ff88]">Grid</span>
              </h1>
              <p className="text-[10px] text-[#4a7c5c] tracking-widest uppercase">AGRIMIND AI</p>
            </div>
          </div>
          <nav className="px-2 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActive
                        ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                        : 'text-[#81c784] hover:bg-[rgba(0,255,136,0.05)]'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
