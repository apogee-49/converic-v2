'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { deDE } from '@clerk/localizations';
import ConvexClientProvider from '@/providers/ConvexClientProvider';
import AuthProvider from '@/providers/AuthProvider';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  const isDashboardSection = (
    pathname === '/' ||
    pathname?.startsWith('/assets') ||
    pathname?.startsWith('/pages') ||
    pathname?.startsWith('/leads') ||
    pathname?.startsWith('/statistiken')
  );

  // Für nicht-Dashboard-Routen (z.B. /{slug}) gar nicht wrappen
  if (!isAuthRoute && !isDashboardSection) {
    return children;
  }

  return (
    <ClerkProvider appearance={{ theme: 'simple' }} localization={deDE}>
      {isAuthRoute ? (
        children
      ) : (
        <ConvexClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConvexClientProvider>
      )}
    </ClerkProvider>
  );
}