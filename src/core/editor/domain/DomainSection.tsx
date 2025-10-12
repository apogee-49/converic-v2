"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { DomainStatusBadge } from "./StatusBadge"
import { DomainInfo } from "./DomainInfo"
import { Link2Icon, RefreshCcw, Loader, OctagonAlert } from "lucide-react"
import { Section } from "@/components/settings-section"

interface DomainSectionProps {
  isLoading: boolean
  customDomain: string | null
  domainStatus: "verified" | "unverified"
  isCheckingStatus: boolean
  isSavingDomain: boolean
  isDeletingDomain: boolean
  dnsRecords: Array<{ type: string; name: string; value: string }>
  errorMessage: string | null
  inputDomain: string
  setInputDomain: (value: string) => void
  onRefresh: () => void
  onSave: (domain: string) => Promise<void>
  onDelete: (domain: string) => Promise<void>
  onCopy: (value: string) => void
}

export function DomainSection(props: DomainSectionProps) {
  const {
    isLoading,
    customDomain,
    domainStatus,
    isCheckingStatus,
    isSavingDomain,
    isDeletingDomain,
    dnsRecords,
    errorMessage,
    inputDomain,
    setInputDomain,
    onRefresh,
    onSave,
    onDelete,
    onCopy,
  } = props

  const canSave = !customDomain && !!inputDomain.trim()

  return (
    <Section
      title="Domain"
      description="Verbinden Sie Ihre eigene Domain für ein vollständig markenkonformes Erlebnis."
      icon={<Link2Icon className="h-4 w-4" />}
      onSave={async () => {
        if (!customDomain && inputDomain.trim()) {
          await onSave(inputDomain)
        }
      }}
      isLoading={isLoading}
      isSaving={isSavingDomain}
      hasChanges={canSave}
      footerActions={customDomain ? (
        <>
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isCheckingStatus}
            className="gap-2"
          >
            {isCheckingStatus ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            {isCheckingStatus ? "Aktualisieren" : "Aktualisieren"}
          </Button>
          <Button
            variant="outline"
            onClick={async () => { if (customDomain) { await onDelete(customDomain) } }}
            disabled={isDeletingDomain}
            className="gap-2"
          >
            {isDeletingDomain && <Loader className="h-4 w-4 animate-spin" />}
            {isDeletingDomain ? "Entfernen" : "Entfernen"}
          </Button>
        </>
      ) : undefined}
    >
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
              <div className="flex items-start">
                <div className="flex flex-col gap-2">
                  <Link
                    href={`https://${customDomain}`}
                    target="_blank"
                    className="text-foreground font-medium w-fit flex items-center gap-1 hover:underline group"
                  >
                    {customDomain}
                    <Link2Icon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <DomainStatusBadge status={domainStatus} isLoading={isCheckingStatus} />
                </div>
              </div>

              <DomainInfo dnsRecords={dnsRecords} errorMessage={errorMessage} onCopy={onCopy} />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm/6 font-medium text-gray-900" htmlFor="domain" data-invalid={errorMessage === "Invalid request body or domain format" ? "true" : undefined}>
                  Domain hinzufügen
                </Label>
                <Input
                  id="domain"
                  value={inputDomain}
                  onChange={(e) => setInputDomain(e.target.value)}
                  placeholder="beispiel.com"
                  className="w-full"
                  disabled={isSavingDomain}
                  aria-invalid={errorMessage === "Invalid request body or domain format"}
                  aria-describedby={errorMessage === "Invalid request body or domain format" ? "domain-error" : undefined}
                />
                {errorMessage === "Invalid request body or domain format" && (
                  <p id="domain-error" className="text-sm text-destructive flex items-center gap-1.5">
                    <OctagonAlert className="w-4 h-4" />
                    Bitte geben Sie eine gültige Domain ein
                  </p>
                )}
              </div>
              <DomainInfo dnsRecords={dnsRecords} errorMessage={null} onCopy={onCopy} />
            </div>
          )}
        </div>
      )}
    </Section>
  )
}


