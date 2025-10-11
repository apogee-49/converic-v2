import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Vercel } from '@vercel/sdk';
import { Redis } from '@upstash/redis';
import { tryCatch } from '@/lib/tryCatch';
import { env } from '@/env';

interface VercelConfig { ok: true }


// Upstash KV (domain → slug)
const redis = new Redis({
  url: env.DOMAIN_KV_REST_API_URL,
  token: env.DOMAIN_KV_REST_API_TOKEN,
});

async function kvGetDel(domain: string): Promise<string | null> {
  const key = `domain:${domain}`;
  return await redis.getdel<string>(key);
}


// Vercel
const vercel = new Vercel({ bearerToken: env.VERCEL_TOKEN });
const teamParams: undefined | { teamId: string } = env.VERCEL_TEAM_ID
  ? { teamId: env.VERCEL_TEAM_ID }
  : undefined;

async function deleteDomainFromVercel(domain: string): Promise<VercelConfig> {
  try {
    await vercel.projects.removeProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      domain,
      ...(teamParams ? { teamId: teamParams.teamId } : {}),
    });
  } catch (e: any) {
    console.warn('deleteProjectDomain warning:', e?.message ?? String(e));
  }
  return { ok: true };
}


export async function DELETE(req: Request) {
  const { data: body, error: parseError } = await tryCatch(req.json());
  if (parseError) {
    return NextResponse.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid request body' } },
      { status: 400 }
    );
  }

  const domain = body?.domain;

  // Remove from Vercel
  const { error: vercelError } = await tryCatch(deleteDomainFromVercel(domain));
  if (vercelError) {
    return NextResponse.json(
      { error: { code: 'VERCEL_ERROR', message: vercelError.message } },
      { status: 502 }
    );
  }

  // Delete KV mapping
  const { data: slug, error: kvError } = await tryCatch(kvGetDel(domain));
  if (kvError) {
    return NextResponse.json(
      { error: { code: 'KV_ERROR', message: kvError.message } },
      { status: 500 }
    );
  }

  if (slug) {
    revalidatePath(`/${slug}`);
  }

  return NextResponse.json(
    {
      ok: true,
      domain,
      slug: slug ?? null,
    },
    { status: 200 }
  );
}