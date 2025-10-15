'use client';

import { ClerkProvider } from '@clerk/nextjs';
import ConvexClientProvider from '@/providers/ConvexClientProvider';
import AuthProvider from '@/providers/AuthProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <AuthProvider>{children}</AuthProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}