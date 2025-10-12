"use client"

import { Button } from "@/components/ui/button"
import { Loader } from 'lucide-react'
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
     footerActions?: ReactNode
}

export function Section({ title, description, children, onSave, isSaving, hasChanges, footerActions }: SectionProps) {
  const isDisabled = (isSaving ?? false) || !(hasChanges ?? false);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3">
      <div className="px-4 sm:px-0 flex flex-col gap-1">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm/6 text-gray-600">{description}</p>
      </div>

      <div className="md:col-span-2">
        <div className="relative px-4 py-6 sm:p-8 bg-background border border-border z-10 sm:rounded-2xl -mb-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8">
            {children}
          </div>
        </div>
        <div className="relative flex items-center rounded-b-2xl border border-border justify-start z-0 gap-x-2 bg-muted px-4 pb-4 pt-8 sm:px-8">
          {footerActions ? (
            <div className="flex items-center gap-x-2">{footerActions}</div>
          ) : (
            <Button variant="outline" onClick={onSave} disabled={isDisabled} className="gap-2">
              {isSaving && <Loader className="w-4 h-4 animate-spin" />}
              {isSaving ? "Speichern" : "Speichern"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 