"use client"

import * as React from "react"
import type { Id } from "@/../convex/_generated/dataModel"
import AuthProvider from "@/providers/AuthProvider"
import PagesList from "@/components/common/pages/list"
import Editor from "@/components/common/pages/editor"
import { useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"

export default function Page() {
  const [selected, setSelected] = React.useState<Id<"landingPages"> | null>(null)
  const page = useQuery(api.landingPages.getPage, selected ? { landingPageId: selected } : "skip")
  return (
    <AuthProvider
      headerBasePathLabel="Dashboard"
      headerPageId={selected ?? undefined}
      headerPageTitle={selected ? (page?.title ?? "") : undefined}
      headerOnBack={selected ? () => setSelected(null) : undefined}
    >
      {selected === null ? <PagesList onSelect={setSelected} /> : <Editor pageId={selected} />}
    </AuthProvider>
  )
}
