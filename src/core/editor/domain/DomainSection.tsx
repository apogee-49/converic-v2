"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { DomainStatusBadge } from "./StatusBadge"
import { DomainInfo } from "./DomainInfo"
import { Link2Icon, RefreshCcw, Loader } from "lucide-react"

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

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div className="px-4 sm:px-0 flex flex-col gap-1">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Domain</h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Verbinden Sie Ihre eigene Domain für ein vollständig markenkonformes Erlebnis.
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
                        className="text-foreground font-medium w-fit flex items-center gap-1 hover:underline group"
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
                        onClick={onRefresh}
                        disabled={isCheckingStatus}
                        className="h-8 gap-2"
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
                        size="sm"
                        onClick={async () => { if (customDomain) { await onDelete(customDomain) } }}
                        disabled={isDeletingDomain}
                        className="h-8 gap-2"
                      >
                        {isDeletingDomain && <Loader className="h-4 w-4 animate-spin" />}
                        {isDeletingDomain ? "Entfernen" : "Entfernen"}
                      </Button>
                    </div>
                  </div>

                  <DomainInfo dnsRecords={dnsRecords} errorMessage={errorMessage} onCopy={onCopy} />
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
                      disabled={isSavingDomain}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-x-6 -mx-4 -mb-6 sm:-mx-8 sm:-mb-8 sm:mt-4 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                    <Button
                      onClick={async () => {
                        await onSave(inputDomain)
                      }}
                      disabled={isSavingDomain || !inputDomain.trim()}
                      className="gap-2"
                    >
                      {isSavingDomain && <Loader className="w-4 h-4 animate-spin" />}
                      {isSavingDomain ? "Hinzufügen..." : "Hinzufügen"}
                    </Button>
                  </div>
                  <DomainInfo dnsRecords={dnsRecords} errorMessage={errorMessage} onCopy={onCopy} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


