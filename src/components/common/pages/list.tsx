"use client"

import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import type { Doc, Id } from "@/../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import CreateDialog from "@/components/dialog/create-page"
import { filterPagesByQuery } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontalIcon,
  Link2Icon,
  PencilIcon,
  TrashIcon,
  ActivityIcon,
  CalendarDays,
} from "lucide-react"

interface PagesListProps {
  onSelect: (id: Id<"landingPages">) => void
}

type LandingPage = Doc<"landingPages">

const formatDateShort = (ts: number) =>
  new Date(ts).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

export default function PagesList({ onSelect }: PagesListProps) {
  const pages = useQuery(api.landingPages.getPages, {}) as LandingPage[] | undefined
  const removeLanding = useMutation(api.landingPages.remove)
  const [query, setQuery] = React.useState("")
  const filteredPages: Array<LandingPage> = filterPagesByQuery<LandingPage>(pages ?? [], query)

  async function onDelete(id: Id<"landingPages">) {
    const ok = window.confirm("Wirklich löschen?")
    if (!ok) return
    await removeLanding({ landingPageId: id })
  }

  const copyLink = async (slug: string) => {
    const url = `https://beispiel.com/${slug}`
    await navigator.clipboard.writeText(url)
  }

  const renderDropdownMenu = (p: LandingPage) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontalIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(p._id) }}>
          <PencilIcon className="mr-2 h-4 w-4 " />
          Bearbeiten
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); void copyLink(p.slug) }}>
          <Link2Icon className="mr-2 h-4 w-4" />
          Link kopieren
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => { e.stopPropagation(); void onDelete(p._id) }}
          className="text-destructive focus:text-destructive"
        >
          <TrashIcon className="mr-2 h-4 w-4" />
          Löschen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <CreateDialog />
      </div>

      {!pages && <p className="text-sm text-muted-foreground">Lade…</p>}

      {pages && pages.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-14">
          <p className="mb-3 text-sm text-muted-foreground">Keine Landingpages vorhanden.</p>
          <CreateDialog label="Neue Landingpage" />
        </div>
      )}

      {pages && pages.length > 0 && filteredPages.length === 0 && query.trim().length > 0 && (
        <p className="text-sm text-muted-foreground">Keine Treffer für „{query}“.</p>
      )}

      {pages && pages.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPages.map((p: LandingPage) => (
            <Card
              key={p._id}
              className="bg-muted rounded-md p-0 hover:border-muted-foreground/30 cursor-pointer duration-200 h-full"
              onClick={() => onSelect(p._id)}
            >
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center" />
                    <div>
                      <div className="font-medium text-sm leading-tight mb-1">{p.title}</div>
                      <Link
                        href={`https://beispiel.com/${p.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        className="text-muted-foreground w-fit flex items-center gap-1 hover:underline group text-sm"
                      >
                        beispiel.com/{p.slug}
                        <Link2Icon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </div>
                  </div>
                  <div className="ml-2 mt-1 flex items-center gap-1">
                    <Link
                      href={`https://beispiel.com/${p.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      className="w-fit flex items-center border-[2px] rounded-full p-1.5"
                    >
                      <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                    </Link>
                    {renderDropdownMenu(p)}
                  </div>
                </div>

                <div className="flex justify-end text-xs text-muted-foreground">
                  <div className="flex gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDateShort(p.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}