"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { ScanSearchIcon, XIcon } from 'lucide-react'
import { Section } from '@/components/settings-section'
import type { MetaSectionProps } from './types'
import { useState } from "react"    

const LIMITS = {
  title: 60,
  description: 200,
  keyword: 50,
  maxKeywords: 20
}

export function MetaSection({ settings, setSettings, isLoading, onSave, isSaving, hasChanges }: MetaSectionProps) {
  const [newKeyword, setNewKeyword] = useState("")

  const addKeyword = () => {
    if (newKeyword.trim() && 
        newKeyword.trim().length <= LIMITS.keyword && 
        settings.meta.keywords.length < LIMITS.maxKeywords &&
        !settings.meta.keywords.includes(newKeyword.trim())) {
      setSettings({
        ...settings,
        meta: {
          ...settings.meta,
          keywords: [...settings.meta.keywords, newKeyword.trim()]
        }
      })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setSettings({
      ...settings,
      meta: {
        ...settings.meta,
        keywords: settings.meta.keywords.filter(keyword => keyword !== keywordToRemove)
      }
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
    if (e.key === 'Backspace' && newKeyword === '' && settings.meta.keywords.length > 0) {
      e.preventDefault()
      const lastKeyword = settings.meta.keywords[settings.meta.keywords.length - 1]
      if (lastKeyword) {
        removeKeyword(lastKeyword)
      }
    }
  }

  const updateMeta = (field: string, value: any) => {
    setSettings({ ...settings, meta: { ...settings.meta, [field]: value } })
  }

  const getCharacterCount = (text: string, limit: number) => (
    <span className={`text-xs ${text.length > limit ? 'text-red-500' : 'text-muted-foreground'}`}>
      {text.length}/{limit}
    </span>
  )

  return (
    <Section
      title="Meta-Daten"
      description="Der Titel und die Meta-Beschreibung bestimmen, wie deine Landing Page in Suchmaschinen angezeigt wird."
      icon={<ScanSearchIcon className="w-4 h-4" />}
      onSave={onSave}
      isLoading={isLoading}
      isSaving={isSaving}
      hasChanges={hasChanges}
    >
      <div className="col-span-full">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <Label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
              Seitentitel
            </Label>
            <div className="mt-2 relative">
              <Input
                id="title"
                value={settings.meta.title}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="Meine Landing Page"
                className="block w-full rounded-md px-3 py-1.5 pr-16"
                maxLength={LIMITS.title}
              />
              <div className="absolute bottom-2 right-3">
                {getCharacterCount(settings.meta.title, LIMITS.title)}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="col-span-full">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[88px] w-full" />
          </div>
        ) : (
          <>
            <Label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
              Seitenbeschreibung
            </Label>
            <div className="mt-2 relative">
              <Textarea
                value={settings.meta.description}
                placeholder="Kurze Beschreibung Ihrer Landing Page."
                className="w-full p-3 border rounded-lg text-sm text-foreground placeholder:text-muted-foreground pr-16"
                rows={3}
                onChange={(e) => updateMeta('description', e.target.value)}
                maxLength={LIMITS.description}
              />
              <div className="absolute bottom-2 right-3">
                {getCharacterCount(settings.meta.description, LIMITS.description)}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="col-span-full">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[88px] w-full" />
          </div>
        ) : (
          <>
            <Label htmlFor="keywords" className="block text-sm/6 font-medium text-gray-900">
              Keywords
            </Label>
            <div className="mt-2 relative">
              <div className="min-h-[42px] w-full border rounded-md px-3 py-2 bg-background">
                {settings.meta.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.meta.keywords.map((keyword, index) => (
                      <div key={index} className="bg-muted px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                        <span>{keyword}</span>
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:bg-muted-foreground/20 rounded-sm p-0.5 transition-colors"
                        >
                          <XIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  id="keywords"
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={settings.meta.keywords.length >= LIMITS.maxKeywords ? "Maximale Anzahl Keywords erreicht" : "Gebe ein Keyword ein und drücke Enter..."}
                  className="w-full bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
                  maxLength={LIMITS.keyword}
                  disabled={settings.meta.keywords.length >= LIMITS.maxKeywords}
                />
              </div>
              <div className="absolute bottom-2 right-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{settings.meta.keywords.length}/{LIMITS.maxKeywords}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="col-span-full">
        <div className="flex items-center gap-x-3">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-11" />
              <Skeleton className="h-5 w-44" />
            </>
          ) : (
            <>
              <Switch
                id="indexed"
                checked={settings.meta.indexed}
                onCheckedChange={(checked) => updateMeta('indexed', checked)}
              />
              <Label htmlFor="indexed" className="text-sm/6 font-medium text-gray-900">
                In Suchmaschinen anzeigen
              </Label>
            </>
          )}
        </div>
      </div>
    </Section>
  )
} 