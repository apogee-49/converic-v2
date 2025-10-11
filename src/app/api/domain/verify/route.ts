import { NextResponse } from 'next/server'
import { Vercel } from '@vercel/sdk'
import { tryCatch } from '@/lib/tryCatch'
import { normalizeDomain } from '@/lib/utils'
import { env } from '@/env'

interface DnsRecord {
  type: string
  name: string
  value: string
}

const vercel = new Vercel({ bearerToken: env.VERCEL_TOKEN })

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

  const { domain } = normalized

  const { data: projectDomain, error } = await tryCatch(
    vercel.projects.getProjectDomain({
      idOrName: env.VERCEL_PROJECT_ID,
      domain,
      teamId: env.VERCEL_TEAM_ID,
    }),
  )
  if (error) {
    return NextResponse.json(
      { error: { code: 'VERCEL_ERROR', message: error.message } },
      { status: 502 },
    )
  }

  const { data: configData, error: configError } = await tryCatch(
    vercel.domains.getDomainConfig({
      domain,
      teamId: env.VERCEL_TEAM_ID,
      projectIdOrName: env.VERCEL_PROJECT_ID,
    }),
  )
  if (configError) {
    return NextResponse.json(
      { error: { code: 'VERCEL_ERROR', message: configError.message } },
      { status: 502 },
    )
  }

  const isConfigured = Boolean(configData && configData.misconfigured === false)

  const dnsRecords: Array<DnsRecord> = []

  // Ownership-Verifikation
  if (!projectDomain?.verified && Array.isArray(projectDomain?.verification) && projectDomain.verification.length > 0) {
    for (const v of projectDomain.verification) {
      dnsRecords.push({ type: v.type ?? '', name: v.domain, value: v.value })
    }
  }

  // DNS Empfehlungen
  if (!isConfigured && configData) {
    const sub = normalized.sub
    const topIPv4 = (configData.recommendedIPv4 ?? []).sort((a, b) => a.rank - b.rank)[0]?.value?.[0]
    const topCNAME = (configData.recommendedCNAME ?? []).sort((a, b) => a.rank - b.rank)[0]?.value

    if (sub) {
      if (topCNAME) dnsRecords.push({ type: 'CNAME', name: sub, value: topCNAME })
    } else {
      if (topIPv4) dnsRecords.push({ type: 'A', name: '@', value: topIPv4 })
      if (topCNAME) dnsRecords.push({ type: 'CNAME', name: 'www', value: topCNAME })
    }
  }

  return NextResponse.json(
    { ok: true, domain, verified: isConfigured, dnsRecords },
    { status: 200 },
  )
}