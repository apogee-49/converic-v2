"use client"

import { useCallback, useEffect, useState } from "react"
import { useMutation } from "convex/react"
import type { Id } from "@/../convex/_generated/dataModel"
import { api } from "@/../convex/_generated/api"
import { tryCatch } from "@/lib/tryCatch"

export interface DnsRecord {
  type: string
  name: string
  value: string
}

export type DomainResponse =
  | { ok: true; domain: string; verified: boolean; dnsRecords: Array<DnsRecord>; slug?: string }
  | { error: { code: string; message?: string } }

interface UseDomainServiceParams {
  pageId: Id<"landingPages">
  slug: string | null
  customDomain: string | null
}

interface UseDomainServiceResult {
  dnsRecords: Array<DnsRecord>
  domainStatus: "verified" | "unverified"
  isCheckingStatus: boolean
  isSavingDomain: boolean
  saveDomain: (domain: string) => Promise<DomainResponse>
  getDomainStatus: () => Promise<DomainResponse | null>
  errorMessage: string | null
}

export function useDomainService(params: UseDomainServiceParams): UseDomainServiceResult {
  const { pageId, slug, customDomain } = params
  const updateLandingPage = useMutation(api.landingPages.update)

  const [dnsRecords, setDnsRecords] = useState<Array<DnsRecord>>([])
  const [domainStatus, setDomainStatus] = useState<"verified" | "unverified">("unverified")
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false)
  const [isSavingDomain, setIsSavingDomain] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const applyDomainResponse = useCallback(
    (response: DomainResponse) => {
      if ("error" in response) {
        setDnsRecords([])
        setDomainStatus("unverified")
        setErrorMessage(response.error.message ?? "Unbekannter Fehler")
      } else {
        setDnsRecords(response.dnsRecords ?? [])
        setDomainStatus(response.verified ? "verified" : "unverified")
        setErrorMessage(null)
      }
    },
    [setDnsRecords, setDomainStatus, setErrorMessage],
  )
  const addDomain = useCallback(async (slug: string, domain: string): Promise<DomainResponse> => {
    const { data, error } = await tryCatch(
      fetch("/api/domain/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug, domain: domain }),
      }).then((res) => res.json() as Promise<DomainResponse>),
    )
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { error: { code: "NETWORK_ERROR", message } }
    }

    return data as DomainResponse
  }, [])

  const verifyDomain = useCallback(async (domain: string): Promise<DomainResponse> => {
    const { data, error } = await tryCatch(
      fetch(`/api/domain/verify?domain=${encodeURIComponent(domain)}`).then(
        (res) => res.json() as Promise<DomainResponse>,
      ),
    )
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { error: { code: "NETWORK_ERROR", message } }
    }
    return data as DomainResponse
  }, [])

  const getDomainStatus = useCallback(async (): Promise<DomainResponse | null> => {
    if (!slug || !customDomain) {
      setDnsRecords([])
      setDomainStatus("unverified")
      setIsCheckingStatus(false)
      return null
    }

    setIsCheckingStatus(true)
    const response = await verifyDomain(customDomain)
    applyDomainResponse(response)
    setIsCheckingStatus(false)
    return response
  }, [slug, customDomain, verifyDomain, applyDomainResponse])

  
  const saveDomain = useCallback(
    async (domainInput: string): Promise<DomainResponse> => {
      setIsSavingDomain(true)
      try {
        const response = await addDomain(slug ?? "", domainInput)
        if ("error" in response) {
          setErrorMessage(response.error.message ?? "Unbekannter Fehler")
        } else {
          try {
            await updateLandingPage({
              landingPageId: pageId,
              customDomain: response.domain,
            })
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e)
            setErrorMessage(message || "Unbekannter Fehler")
          }

          const status = await verifyDomain(response.domain)
          applyDomainResponse(status)
        }

        return response
      } finally {
        setIsSavingDomain(false)
      }
    },
    [slug, pageId, addDomain, updateLandingPage, verifyDomain, applyDomainResponse],
  )

  useEffect(() => {
    void getDomainStatus()
  }, [getDomainStatus])

  return {
    dnsRecords,
    domainStatus,
    isCheckingStatus,
    isSavingDomain,
    saveDomain,
    getDomainStatus,
    errorMessage,
  }
}