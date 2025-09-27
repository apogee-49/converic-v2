"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import type { ReactNode } from "react"


export interface SectionProps {
     title: string
     description: string
     icon: ReactNode
     children: ReactNode
     onSave: () => void
     isLoading: boolean
     isSaving?: boolean
     hasChanges?: boolean
}

export function Section({ title, description, children, onSave, isSaving, hasChanges }: SectionProps) {
  const isDisabled = (isSaving ?? false) || !(hasChanges ?? false);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
      <div className="px-4 sm:px-0 flex flex-col gap-1">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm/6 text-gray-600">{description}</p>
      </div>

      <div className="bg-white ring-1 ring-border sm:rounded-lg md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8">
            {children}
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <Button onClick={onSave} disabled={isDisabled} className="gap-2">
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Wird gespeichert..." : "Speichern"}
          </Button>
        </div>
      </div>
    </div>
  )
} 