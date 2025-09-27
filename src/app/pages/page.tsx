"use client"

import * as React from "react"
import type { Id } from "@/../convex/_generated/dataModel"
import AuthProvider from "@/providers/AuthProvider"
import PagesList from "@/components/common/pages/list"
import Editor from "@/components/common/pages/editor"

export default function Page() {
  const [selected, setSelected] = React.useState<Id<"landingPages"> | null>(null)
  return (
    <AuthProvider>
      {selected === null ? (
        <PagesList onSelect={setSelected} />
      ) : (
        <Editor pageId={selected} onBack={() => setSelected(null)} />
      )}
    </AuthProvider>
  )
}
