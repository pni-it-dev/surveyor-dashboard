'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, Lock, Settings, BarChart3, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavbarProps {
  user?: {
    name?: string;
    email?: string;
  };
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleDownloadDashboardPDF = () => {
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Add title
      doc.setFontSize(20);
      doc.text('Primaboga Trade Analysis Dashboard', 14, 15);

      // Add generation date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

      // Add note about charts
      doc.setFontSize(9);
      const note =
        'This PDF contains the dashboard report snapshot. For interactive charts, please visit the dashboard.';
      const lines = doc.splitTextToSize(note, pageWidth - 28);
      doc.text(lines, 14, 35);

      // Add footer
      doc.setFontSize(8);
      doc.text(
        'This is an automatically generated report. Page 1 of 1',
        14,
        pageHeight - 10
      );

      doc.save('primaboga-trade-analysis-report.pdf');
    } catch (error) {
      console.error('[PDF DOWNLOAD ERROR]', error);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Image
                src="/farina-logo.png"
                alt="Farina Logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-bold text-foreground text-sm leading-tight">Primaboga Trade</span>
                <span className="text-xs text-muted-foreground leading-tight">Analysis Dashboard</span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button
                  variant={isActive('/dashboard') ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </nav>
          </div>

          {/* Right section - Theme toggle and Account menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 text-sm font-medium"
                >
                  <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary overflow-hidden border border-border/50">
                    <Image
                      src="/placeholder-user.jpg"
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="hidden sm:inline">{user.name || user.email || 'Account'}</span>
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col gap-2 px-2 py-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                {pathname === '/dashboard' && (
                  <>
                    <DropdownMenuItem
                      onClick={handleDownloadDashboardPDF}
                      className="gap-2 cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF Report</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={handleResetPassword}
                  className="gap-2 cursor-pointer"
                >
                  <Lock className="h-4 w-4" />
                  <span>Reset Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer opacity-50 pointer-events-none"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings (Coming Soon)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
