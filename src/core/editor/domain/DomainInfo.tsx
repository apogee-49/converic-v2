"use client"

import { DNSRecordsTable } from "./RecordsTable"
import { Separator } from "@/components/ui/separator"

interface DomainInfoProps {
  dnsRecords: Array<{ type: string; name: string; value: string }>
  errorMessage: string | null
  onCopy: (value: string) => void
}

export function DomainInfo({ dnsRecords, errorMessage, onCopy }: DomainInfoProps) {
  const filteredError = errorMessage === "Invalid request body or domain format" ? null : errorMessage
  if (dnsRecords.length === 0 && !filteredError) return null
  return (
    <div className="flex flex-col gap-4 mt-1">
      <Separator />
      <div>
        <h3 className="text-sm font-medium text-foreground">Schritt 1: DNS-Einträge hinzufügen</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Fügen Sie die folgenden DNS-Einträge in den Einstellungen Ihres Domain-Providers hinzu:
        </p>
        {dnsRecords.length > 0 && (
          <div className="mt-4">
            <DNSRecordsTable records={dnsRecords} onCopy={onCopy} />
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="text-sm font-medium text-foreground">Schritt 2: Verifizieren & Verbinden</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Klicken Sie auf &quot;Aktualisieren&quot;, um die Einrichtung abzuschließen.
        </p>
        {filteredError && (
          <div className="mt-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {filteredError}
          </div>
        )}
      </div>
    </div>
  )
}


