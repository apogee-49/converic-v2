"use client"

import { useCallback, useEffect, useState } from "react"
import { useMutation } from "convex/react"
import type { Id } from "@/../convex/_generated/dataModel"
import { api } from "@/../convex/_generated/api"
import { tryCatch } from "@/lib/tryCatch"

interface DnsRecord { type: string; name: string; value: string }

type DomainResponse =
  | { ok: true; domain: string; verified: boolean; dnsRecords: DnsRecord[]; slug?: string }
  | { error: { code: string; message?: string } }

type DeleteResponse =
  | { ok: true; domain: string; slug: string | null }
  | { error: { code: string; message?: string } }

interface UseDomainServiceParams {
  pageId: Id<"landingPages">
  slug: string | null
  customDomain: string | null
}

interface UseDomainServiceResult {
  dnsRecords: DnsRecord[]
  domainStatus: "verified" | "unverified"
  isCheckingStatus: boolean
  isSavingDomain: boolean
  isDeletingDomain: boolean
  saveDomain: (domain: string) => Promise<DomainResponse>
  deleteDomain: (domain: string) => Promise<DeleteResponse>
  getDomainStatus: (opts?: { force?: boolean }) => Promise<void>
  errorMessage: string | null
}

export function useDomainService(params: UseDomainServiceParams): UseDomainServiceResult {
  const { pageId, slug, customDomain } = params
  const updateLandingPage = useMutation(api.landingPages.update)

  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([])
  const [domainStatus, setDomainStatus] = useState<"verified" | "unverified">("unverified")
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [isSavingDomain, setIsSavingDomain] = useState(false)
  const [isDeletingDomain, setIsDeletingDomain] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  
  const resetToUnverified = useCallback((message?: string) => {
    setDnsRecords([])
    setDomainStatus("unverified")
    setErrorMessage(message ?? null)
  }, [])


  const setDomainState = useCallback((response: DomainResponse) => {
    if ("error" in response) {
      resetToUnverified(response.error.message ?? "Unbekannter Fehler")
      return
    }
    setDnsRecords(response.dnsRecords)
    setDomainStatus(response.verified ? "verified" : "unverified")
    setErrorMessage(null)
  }, [resetToUnverified])


  const jsonRequest = useCallback(async <T,>(url: string, options?: RequestInit): Promise<T> => {
    const { data, error } = await tryCatch(fetch(url, options).then((r) => r.json()))
    return error ? { error: { code: "NETWORK_ERROR", message: String(error) } } as T : data as T
  }, [])


  const addDomain = useCallback(
    async (slugValue: string, domainValue: string): Promise<DomainResponse> =>
      jsonRequest<DomainResponse>("/api/domain/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugValue, domain: domainValue }),
      }),
    [jsonRequest]
  )

  const verifyDomain = useCallback(
    async (domainValue: string): Promise<DomainResponse> =>
      jsonRequest<DomainResponse>(`/api/domain/verify?domain=${encodeURIComponent(domainValue)}`),
    [jsonRequest]
  )


  
  const getDomainStatus = useCallback(
    async (opts?: { force?: boolean }): Promise<void> => {
      if (!customDomain) {
        resetToUnverified()
        return
      }

      if (!opts?.force) {
        try {
          const raw = localStorage.getItem(`verifyCache:${customDomain}`)
          if (raw) {
            const parsed = JSON.parse(raw) as { t?: number; r?: DomainResponse }
            const isFresh = Date.now() - (parsed.t ?? 0) < 300_000
            const fallbackResponse = {
              error: { code: "NETWORK_ERROR", message: "Unbekannter Fehler" },
            }
            setDomainState(parsed.r ?? fallbackResponse)
            if (isFresh) return
          }
        } catch {}
      }

      setIsCheckingStatus(true)
      try {
        const response = await verifyDomain(customDomain)
        setDomainState(response)
        try {
          localStorage.setItem(
            `verifyCache:${customDomain}`,
            JSON.stringify({ t: Date.now(), r: response })
          )
        } catch {}
      } finally {
        setIsCheckingStatus(false)
      }
    },
    [customDomain, verifyDomain, setDomainState, resetToUnverified]
  )



  const saveDomain = useCallback(
    async (domainInput: string): Promise<DomainResponse> => {
      setIsSavingDomain(true)
      try {
        const response = await addDomain(slug ?? "", domainInput)
        
        if ("error" in response) {
          setErrorMessage(response.error.message ?? "Unbekannter Fehler")
          return response
        }
        
        await tryCatch(
          updateLandingPage({ 
            landingPageId: pageId, 
            customDomain: response.domain 
          })
        )
        
        const status = await verifyDomain(response.domain)
        setDomainState(status)
        
        try {
          localStorage.setItem(
            `verifyCache:${response.domain}`, 
            JSON.stringify({ t: Date.now(), r: status })
          )
        } catch {}
        
        return response
      } finally {
        setIsSavingDomain(false)
      }
    },
    [slug, pageId, addDomain, updateLandingPage, verifyDomain, setDomainState]
  )

  

  const deleteDomain = useCallback(
    async (domainInput: string): Promise<DeleteResponse> => {
      setIsDeletingDomain(true)
      try {
        const result = await jsonRequest<DeleteResponse>("/api/domain/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: domainInput }),
        })
        
        if ("error" in result) {
          setErrorMessage(result.error.message ?? "Unbekannter Fehler")
          return result
        }
        
        await tryCatch(
          updateLandingPage({ landingPageId: pageId, customDomain: null })
        )
        
        try {
          localStorage.removeItem(`verifyCache:${domainInput}`)
        } catch {}
        
        resetToUnverified()
        return result
      } finally {
        setIsDeletingDomain(false)
      }
    },
    [pageId, updateLandingPage, resetToUnverified, jsonRequest]
  )


  useEffect(() => {
    void getDomainStatus()
  }, [getDomainStatus])

  return {
    dnsRecords,
    domainStatus,
    isCheckingStatus,
    isSavingDomain,
    isDeletingDomain,
    saveDomain,
    deleteDomain,
    getDomainStatus,
    errorMessage,
  }
}