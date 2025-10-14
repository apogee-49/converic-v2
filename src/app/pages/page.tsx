"use client"

import * as React from "react"
import type { Id } from "@/../convex/_generated/dataModel"
import { useHeader } from "@/providers/AuthProvider"
import PagesList from "@/components/common/pages/list"
import Editor from "@/components/common/pages/editor"
 

export default function Page() {
  const [selected, setSelected] = React.useState<Id<"landingPages"> | null>(null)
  const { updateHeader } = useHeader()
  
  const onSelect = React.useCallback((id: Id<"landingPages">) => {
    setSelected(id)
    updateHeader({ pageId: id, onBack: () => setSelected(null) })
  }, [updateHeader])

  if (selected === null) {
    return <PagesList onSelect={onSelect} />
  }

  return <Editor pageId={selected} />
}
