import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Geschützte Dashboard-Routen explizit matchen
const isProtected = createRouteMatcher([
  '/pages(.*)',
  '/assets(.*)',
  '/leads(.*)',
  '/statistiken(.*)',
]);


export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get('host')?.toLowerCase() ?? '';
  const pathname = req.nextUrl.pathname;


  const appHost = new URL(process.env.NEXT_PUBLIC_SITE_URL!).hostname;
  const pagesBaseHost = 'converic.page';


  const isLocal = host.startsWith('localhost')
  const isVercel = host.endsWith('.vercel.app');
  const isApp = host === appHost;
  const isSlugSubdomain = host.endsWith(`.${pagesBaseHost}`);


  // slug.converic.page
  if (isSlugSubdomain && pathname === '/') {
    const sub = host.slice(0, -(`.${pagesBaseHost}`).length);
    if (sub && sub !== 'www') {
      return NextResponse.rewrite(new URL(`/${sub}`, req.url));
    }
  }


  // Custom-Domain
  if (!isLocal && !isVercel && !isApp && !isSlugSubdomain && pathname === '/') {
    const upstashUrl = process.env.DOMAIN_KV_REST_API_URL;
    const token = process.env.DOMAIN_KV_REST_API_READ_ONLY_TOKEN;

    if (upstashUrl && token) {
      const redis = new Redis({ url: upstashUrl, token });
      const candidates: Array<string> = host.startsWith('www.') ? [host, host.slice(4)] : [host];

      let slug: string | null = null;
      for (const h of candidates) {
        slug = await redis.get<string>(`domain:${h}`);
        if (slug) break;
      }
      if (slug && /^[a-z0-9-]+$/i.test(slug)) {
        return NextResponse.rewrite(new URL(`/${slug}`, req.url));
      }
    }
  }


  // Auth
  const [top] = req.nextUrl.pathname.split('/').filter(Boolean);

  if (top === 'api') return;

  if (req.nextUrl.hostname === appHost && isProtected(req)) {
    const session = await auth();
    if (!session.userId) return session.redirectToSignIn();
  }
}, (req) => {
  const primaryHost = new URL(process.env.NEXT_PUBLIC_SITE_URL!).hostname;
  const isSatellite = req.nextUrl.hostname !== primaryHost;

  return {
    isSatellite,
    domain: primaryHost,
    signInUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/sign-in`,
    signUpUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up`,
    debug: process.env.NODE_ENV === 'development',
  };
});


export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};