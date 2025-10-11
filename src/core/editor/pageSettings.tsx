"use client"

import type { Id } from "@/../convex/_generated/dataModel"
import { useMemo, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { useDomainService } from "@/hooks/useDomainService"
import { DomainSection } from "./domain/DomainSection"

interface Props {
  pageId: Id<"landingPages">
}

export default function PageSettings(props: Props) {
  const page = useQuery(api.landingPages.getPage, {
    landingPageId: props.pageId,
  })

  const [inputDomain, setInputDomain] = useState<string>("")

  const customDomain = useMemo<string | null>(() => {
    const raw: string = String(page?.customDomain ?? "")
    const value = raw.trim()
    return value.length > 0 ? value : null
  }, [page])

  const {
    dnsRecords,
    domainStatus,
    isCheckingStatus,
    isSavingDomain,
    isDeletingDomain,
    saveDomain,
    deleteDomain,
    getDomainStatus,
    errorMessage,
  } = useDomainService({ pageId: props.pageId, slug: page?.slug ?? null, customDomain });

  const handleCopy = (value: string) => { void navigator.clipboard.writeText(value) }

  const isLoading = typeof page === "undefined"

  return (
    <div className="border bg-muted border-border rounded-lg flex flex-col gap-4 md:gap-8 p-4 md:p-6">
      <DomainSection
        isLoading={isLoading}
        customDomain={customDomain}
        domainStatus={domainStatus}
        isCheckingStatus={isCheckingStatus}
        isSavingDomain={isSavingDomain}
        isDeletingDomain={isDeletingDomain}
        dnsRecords={dnsRecords}
        errorMessage={errorMessage}
        inputDomain={inputDomain}
        setInputDomain={setInputDomain}
        onRefresh={() => { void getDomainStatus({ force: true }) }}
        onSave={async (domain) => {
          const response = await saveDomain(domain)
          if ("ok" in response && response.ok) setInputDomain("")
        }}
        onDelete={async (domain) => { await deleteDomain(domain) }}
        onCopy={handleCopy}
      />
    </div>
  )
}


