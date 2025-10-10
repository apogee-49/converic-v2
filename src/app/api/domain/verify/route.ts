import { NextResponse } from 'next/server'
import { Vercel } from '@vercel/sdk'
import { tryCatch } from '@/lib/tryCatch'
import { normalizeDomain } from '@/lib/utils'
import { env } from '@/env'

const VERCEL_DNS_CNAME = '8bfbfd0adfe9edc0.vercel-dns-017.com.'
const VERCEL_A_RECORD = '216.198.79.1'

interface DnsRecord {
  type: 'A' | 'CNAME'
  name: string
  value: string
}

const vercel = new Vercel({ bearerToken: env.VERCEL_TOKEN })

function suggestDnsRecords(sub: string, misconfigured?: boolean): Array<DnsRecord> {
  if (!misconfigured) return []
  if (sub) return [{ type: 'CNAME', name: sub, value: VERCEL_DNS_CNAME }]
  return [
    { type: 'A', name: '@', value: VERCEL_A_RECORD },
    { type: 'CNAME', name: 'www', value: VERCEL_DNS_CNAME },
  ]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const raw = searchParams.get('domain') ?? ''
  const normalized = normalizeDomain(raw)
  
  if (!normalized) {
    return NextResponse.json(
      { error: { code: 'INVALID_REQUEST', message: 'Invalid domain' } },
      { status: 400 },
    )
  }

  const { domain, sub } = normalized

  const { data: configData, error } = await tryCatch(
    vercel.domains.getDomainConfig({ domain, teamId: env.VERCEL_TEAM_ID }),
  )
  if (error) {
    return NextResponse.json(
      { error: { code: 'VERCEL_ERROR', message: (error as Error).message } },
      { status: 502 },
    )
  }

  const isMisconfigured = Boolean(configData?.misconfigured);
  const isVerified = !isMisconfigured;

  return NextResponse.json(
    {
      ok: true,
      domain,
      verified: isVerified,
      dnsRecords: suggestDnsRecords(sub, isMisconfigured),
    },
    { status: 200 },
  )
}