"use client"

import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { PaletteIcon, InfoIcon, RefreshCcwIcon, UploadIcon } from 'lucide-react'
import { Section } from '@/components/settings-section'
import type { LayoutSectionProps } from './types'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FileManagerDialog } from "@/components/dialog/file-manager"
import { FaviconPlaceholder } from "@/components/ui/icons/favicon-placeholder"
import { ButtonRadiusNoneIcon, ButtonRadiusMediumIcon, ButtonRadiusFullIcon } from "@/components/ui/icons/icon-library"
import { ColorPickerButton } from "@/components/ui/color-popover"

const buttonRadiusOptions = [
  { 
    label: 'Eckig', 
    value: 'none' as const,
    icon: <ButtonRadiusNoneIcon className="w-full h-auto" />
  },
  { 
    label: 'Abgerundet', 
    value: 'medium' as const,
    icon: <ButtonRadiusMediumIcon className="w-full h-auto" />
  },
  { 
    label: 'Rund', 
    value: 'full' as const,
    icon: <ButtonRadiusFullIcon className="w-full h-auto" />
  }
];

export function LayoutSection({ settings, setSettings, isLoading, onSave, isSaving, hasChanges }: LayoutSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateLayout = (field: string, value: any) => {
    setSettings({ ...settings, layout: { ...settings.layout, [field]: value } })
  }

  const handleFileSelect = (url: string) => {
    updateLayout('favicon', url);
    setIsDialogOpen(false);
  }

  return (
    <Section
      title="Erscheinungsbild"
      description="Hier kannst du Farben, Logos und Schriftarten anpassen, um das Erscheinungsbild deiner Landing Page zu ändern."
      icon={<PaletteIcon className="w-4 h-4" />}
      onSave={onSave}
      isLoading={isLoading}
      isSaving={isSaving}
      hasChanges={hasChanges}
    >
      {/* Favicon Section */}
      <div className="col-span-full">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Label className="block text-sm/6 font-medium text-gray-900">Favicon</Label>
                <div className="bg-background flex flex-col gap-3 mt-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="gap-2">
                      {settings.layout.favicon ? <RefreshCcwIcon className="w-4 h-4" /> : <UploadIcon className="w-4 h-4" />}
                      {settings.layout.favicon ? 'Favicon ändern' : 'Favicon hochladen'}
                    </Button>
                  </div>
                  {!settings.layout.favicon && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <InfoIcon className="w-3.5 h-3.5" />
                      <p className="text-xs">Kein Favicon ausgewählt</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="border border-border bg-muted rounded-xl overflow-hidden">
                <FaviconPlaceholder faviconUrl={settings.layout.favicon} />
              </div>
            </div>
          </>
        )}
      </div>

      <FileManagerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelectImage={handleFileSelect}
        currentImage={settings.layout.favicon}
      />

      {/* Color Pickers */}
      <div className="flex flex-col gap-2 w-full">
        <Label className="block text-sm/6 font-medium text-gray-900">Farben</Label>
        <div className="flex gap-2 w-full">
          {isLoading ? (
            <>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </>
          ) : (
            <>
              <ColorPickerButton
                label="Primärfarbe"
                color={settings.layout.primaryColor}
                onChange={(hex) => updateLayout('primaryColor', hex)}
              />
              <ColorPickerButton
                label="Sekundärfarbe"
                color={settings.layout.secondaryColor}
                onChange={(hex) => updateLayout('secondaryColor', hex)}
              />
            </>
          )}
        </div>
      </div>

      {/* Button Radius */}
      <div className="col-span-full">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-5 w-28" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <Label className="block text-sm/6 font-medium text-gray-900 mb-2">Button Radius</Label>
            <div className="grid grid-cols-3 gap-4">
              {buttonRadiusOptions.map(({ label, value, icon }) => {
                const isSelected = settings.layout.buttonRadius === value;
                return (
                  <label
                    key={value}
                    className={`relative active:scale-97 flex flex-col items-center border border-border p-4 rounded-lg cursor-pointer transition-all duration-200 ease-out ${
                      isSelected ? 'border-primary/30 bg-primary/5' : ''
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-center w-full max-w-[95px] mx-auto">
                      {icon}
                    </div>
                    <span className="text-sm font-regular text-center">{label}</span>
                    <input
                      type="radio"
                      name="buttonRadius"
                      value={value}
                      checked={isSelected}
                      onChange={() => updateLayout('buttonRadius', value)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Section>
  )
} 