'use client';

import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/providers/ConvexClientProvider';
import AuthProvider from '@/providers/AuthProvider';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  return (
    <ClerkProvider>
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