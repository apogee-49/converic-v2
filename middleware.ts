import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);

  // Allow exactly one non-reserved top-level segment (public slug pages)
  const reservedTopLevel = new Set([
    'pages',
    'assets',
    'leads',
    'statistiken',
    'api',
    'revalidate',
  ]);

  const isSingleTopLevel = segments.length === 1;
  const first = segments[0];
  const isReserved = first ? reservedTopLevel.has(first) : false;
  const isPublicSlug = isSingleTopLevel && !!first && !isReserved;

  if (isPublicSlug) return;

  const session = await auth();
  if (!session.userId) return session.redirectToSignIn();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};


