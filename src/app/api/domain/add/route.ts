import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Vercel } from '@vercel/sdk';
import { Redis } from '@upstash/redis';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import { tryCatch } from '@/lib/tryCatch';
import { normalizeDomain } from '@/lib/utils';
import { env } from '@/env';


const VERCEL_DNS_CNAME = '8bfbfd0adfe9edc0.vercel-dns-017.com.';
const VERCEL_A_RECORD = '216.198.79.1';

interface DnsRecord {
  type: 'A' | 'CNAME';
  name: string;
  value: string;
}

interface VercelConfig {
  verified: boolean;
  configData?: {
    misconfigured?: boolean;
  };
}

function parsePayload(input: object): { slug: string; domain: string; sub: string } | null {
  const obj = input as { slug?: string; domain?: string };

  const slug = obj.slug?.trim() ?? '';
  const domain = obj.domain?.trim() ?? '';

  if (!obj.slug || !obj.domain) return null;

  const normalized = normalizeDomain(domain);
  return normalized ? { slug, domain: normalized.domain, sub: normalized.sub } : null;
}
 

function getDnsRecords(sub: string, configData?: VercelConfig['configData']): DnsRecord[] {
  if (configData?.misconfigured) {
    if (sub) {
      return [
        { type: 'CNAME', name: sub, value: VERCEL_DNS_CNAME }
      ];
    } else {
      return [
        { type: 'A', name: '@', value: VERCEL_A_RECORD },
        { type: 'CNAME', name: 'www', value: VERCEL_DNS_CNAME }
      ];
    }
  }
  return [];
}


// Upstash KV (domain → slug)
const redis = Redis.fromEnv();

async function kvSet(domain: string, slug: string): Promise<boolean> {
  const key = `domain:${domain}`;
  const { data, error } = await tryCatch(redis.set(key, slug));
  return !error && data === 'OK';
}


// Convex
const convexClient = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

async function updateConvexDomain(slug: string, domain: string): Promise<void> {
  const page = await convexClient.query(api.landingPages.getLandingPage, { slug });
  
  if (!page?.landingPage) throw new Error('Landing page not found');
  
  await convexClient.mutation(api.landingPages.update, {
    landingPageId: page.landingPage._id,
    customDomain: domain,
  });
}


// Vercel
const vercel = new Vercel({ bearerToken: env.VERCEL_TOKEN });

async function addDomainToVercel(domain: string): Promise<VercelConfig> {
  try {
    await vercel.projects.addProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      requestBody: { name: domain },
    });
  } catch (e: any) {
     console.error(
          e instanceof Error ? `Error: ${e.message}` : String(e),
     );
  }

  const { data: configData } = await tryCatch(
    vercel.domains.getDomainConfig({ domain })
  );
  
  return {
    verified: configData ? !configData.misconfigured : false,
    configData: configData ?? undefined
  };
}


export async function POST(req: Request) {
  
  // Validate
  const { data: body, error: parseError } = await tryCatch(req.json());
  const parsed = parsePayload(body);
  
  if (parseError || !parsed) {
    return NextResponse.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid request body or domain format' } },
      { status: 400 }
    );
  }

  const { slug, domain, sub } = parsed;

  // Add to Vercel
  const { data: vercelResult, error: vercelError } = await tryCatch(addDomainToVercel(domain));
  
  if (vercelError) {
    return NextResponse.json(
      { error: { code: 'VERCEL_ERROR', message: vercelError.message } },
      { status: 502 }
    );
  }

  // Store in KV
  const kvSuccess = await kvSet(domain, slug);
  
  if (!kvSuccess) {
    return NextResponse.json(
      { error: { code: 'KV_ERROR', message: 'Failed to persist domain mapping' } },
      { status: 500 }
    );
  }

  // Update Convex
  const { error: convexError } = await tryCatch(updateConvexDomain(slug, domain));
  if (convexError) {
    return NextResponse.json(
      { error: { code: 'CONVEX_ERROR', message: convexError.message } },
      { status: 500 }
    );
  }

  // Revalidate & return success
  revalidatePath(`/${slug}`);

  const verified = vercelResult?.verified ?? false;
  return NextResponse.json(
    {
      ok: true,
      slug,
      domain,
      verified,
      dnsRecords: getDnsRecords(sub, vercelResult?.configData),
    },
    { status: verified ? 201 : 202 }
  );
}