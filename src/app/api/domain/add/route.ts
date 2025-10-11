import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Vercel } from '@vercel/sdk';
import { Redis } from '@upstash/redis';
import { tryCatch } from '@/lib/tryCatch';
import { normalizeDomain } from '@/lib/utils';
import { env } from '@/env';


interface VercelConfig { ok: true }

function parsePayload(input: object): { slug: string; domain: string } | null {
  const obj = input as { slug?: string; domain?: string };

  const slug = obj.slug?.trim() ?? '';
  const domain = obj.domain?.trim() ?? '';

  if (!obj.slug || !obj.domain) return null;

  const normalized = normalizeDomain(domain);
  return normalized ? { slug, domain: normalized.domain } : null;
}


// Upstash KV (domain → slug)
const redis = new Redis({
  url: env.DOMAIN_KV_REST_API_URL,
  token: env.DOMAIN_KV_REST_API_TOKEN,
})

async function kvSet(domain: string, slug: string): Promise<boolean> {
  const key = `domain:${domain}`;
  const { data, error } = await tryCatch(redis.set(key, slug));
  return !error && data === 'OK';
}


// Vercel
const vercel = new Vercel({ bearerToken: env.VERCEL_TOKEN });
const teamParams: undefined | { teamId: string } = env.VERCEL_TEAM_ID
  ? { teamId: env.VERCEL_TEAM_ID }
  : undefined;

async function addDomainToVercel(domain: string): Promise<VercelConfig> {
  try {
    await vercel.projects.addProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      requestBody: { name: domain },
      ...(teamParams ? { teamId: teamParams.teamId } : {}),
    });
  } catch (e: any) {
    console.warn('addProjectDomain warning:', e?.message ?? String(e));
  }

  return { ok: true };
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

  const { slug, domain } = parsed;

  // Add to Vercel
  const { error: vercelError } = await tryCatch(addDomainToVercel(domain));
  
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

  revalidatePath(`/${slug}`);

  return NextResponse.json(
    {
      ok: true,
      slug,
      domain,
    },
    { status: 201 }
  );
}