"use client"

import type { Id } from "@/../convex/_generated/dataModel"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { DNSRecordsTable } from "./domain/RecordsTable"
import { DomainStatusBadge } from "./domain/StatusBadge"
import { Link2Icon, RefreshCcw, Loader2 } from "lucide-react"

interface Props {
  pageId: Id<"landingPages">
}

type DNSRecord = { type: string; name: string; value: string }

type AddDomainSuccess = {
  ok: true
  slug: string
  domain: string
  verified: boolean
  dnsRecords: Array<DNSRecord>
}

type AddDomainError = {
  error: { code: string; message?: string }
}

export default function PageSettings(props: Props) {
  const page = useQuery(api.landingPages.getPage, {
    landingPageId: props.pageId,
  })

  const [inputDomain, setInputDomain] = useState<string>("")
  const [isDomainActionLoading, setIsDomainActionLoading] = useState<boolean>(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false)
  const [dnsRecords, setDnsRecords] = useState<Array<DNSRecord>>([])
  const [domainStatus, setDomainStatus] = useState<"verified" | "unverified" | "unknown">("unknown")

  const customDomain = useMemo(() => {
    return typeof page?.customDomain === "string" && page.customDomain.trim().length > 0
      ? page.customDomain
      : null
  }, [page])

  useEffect(() => {
    if (!customDomain || !page?.slug) return
    let cancelled = false
    const run = async () => {
      setIsCheckingStatus(true)
      try {
        const res = await fetch("/api/domain/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: page.slug, domain: customDomain }),
        })
        const data: AddDomainSuccess | AddDomainError = await res.json()
        if (cancelled) return
        if ("ok" in data && data.ok) {
          setDnsRecords(data.dnsRecords ?? [])
          setDomainStatus(data.verified ? "verified" : "unverified")
        } else {
          setDomainStatus("unverified")
        }
      } catch {
        if (!cancelled) setDomainStatus("unverified")
      } finally {
        if (!cancelled) setIsCheckingStatus(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [customDomain, page?.slug])

  const handleCopy = (value: string) => {
    void navigator.clipboard.writeText(value)
  }

  const handleSaveDomain = async () => {
    if (!page?.slug) return
    const domain = inputDomain.trim()
    if (!domain) return
    setIsDomainActionLoading(true)
    try {
      const res = await fetch("/api/domain/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: page.slug, domain }),
      })
      const data: AddDomainSuccess | AddDomainError = await res.json()
      if ("ok" in data && data.ok) {
        setDnsRecords(data.dnsRecords ?? [])
        setDomainStatus(data.verified ? "verified" : "unverified")
        setInputDomain("")
      }
    } finally {
      setIsDomainActionLoading(false)
    }
  }

  const checkDomainStatus = async () => {
    if (!customDomain || !page?.slug) return
    setIsCheckingStatus(true)
    try {
      const res = await fetch("/api/domain/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: page.slug, domain: customDomain }),
      })
      const data: AddDomainSuccess | AddDomainError = await res.json()
      if ("ok" in data && data.ok) {
        setDnsRecords(data.dnsRecords ?? [])
        setDomainStatus(data.verified ? "verified" : "unverified")
      }
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const isLoading = typeof page === "undefined"

  return (
    <div className="border bg-muted border-border rounded-lg flex flex-col gap-4 md:gap-8 p-4 md:p-6">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0 flex flex-col gap-1">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Domain</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Verbinde eine eigene Domain mit deiner Landing Page.
          </p>
        </div>

        <div className="bg-background ring-1 ring-border rounded-lg md:col-span-2">
          <div className="px-4 py-6 sm:p-8 flex flex-col gap-6">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-5 w-[150px]" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-[150px]" />
                  </div>
                </div>
                <Separator />
                <div className="flex flex-row gap-6">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {customDomain ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`https://${customDomain}`}
                          target="_blank"
                          className="text-foreground font-medium w-fit flex items-center gap-1 hover:hover:underline group"
                        >
                          {customDomain}
                          <Link2Icon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <DomainStatusBadge status={domainStatus} isLoading={isCheckingStatus} />
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={checkDomainStatus}
                          disabled={isCheckingStatus}
                          className="h-8 gap-2"
                        >
                          {isCheckingStatus ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCcw className="h-4 w-4" />
                          )}
                          {isCheckingStatus ? "Wird aktualisiert..." : "Status aktualisieren"}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {dnsRecords.length > 0 && (
                      <div className="mt-2">
                        <DNSRecordsTable records={dnsRecords} onCopy={handleCopy} />
                        <div className="mt-4 flex border border-border items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                          <p>
                            Füge diese DNS-Einträge bei deinem Domain-Provider hinzu. Wir verifizieren automatisch, sobald die Einträge erkannt wurden.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="domain">Domain hinzufügen</Label>
                      <Input
                        id="domain"
                        value={inputDomain}
                        onChange={(e) => setInputDomain(e.target.value)}
                        placeholder="beispiel.com"
                        className="w-full"
                        disabled={isDomainActionLoading}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-x-6 -mx-4 -mb-6 sm:-mx-8 sm:-mb-8 sm:mt-4 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                      <Button
                        onClick={handleSaveDomain}
                        disabled={isDomainActionLoading || !inputDomain.trim()}
                        className="gap-2"
                      >
                        {isDomainActionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isDomainActionLoading ? "Wird hinzugefügt..." : "Hinzufügen"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


