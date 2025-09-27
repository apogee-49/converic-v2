"use client"

import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import type { Doc, Id } from "@/../convex/_generated/dataModel"
import type { Section } from "./sections/types"
import { SortableList } from "./sections/SortableList"
import { SectionEditor } from "./sections/SectionEditor"
import type { DragEndEvent } from "@dnd-kit/core"

interface Props {
  pageId: Id<"landingPages">
}

export default function PageEditor({ pageId }: Props) {
  const dbSections = useQuery(api.pageSections.getSections, { landingPageId: pageId })
  const createSection = useMutation(api.pageSections.create)
  const updateSection = useMutation(api.pageSections.update)
  const removeSection = useMutation(api.pageSections.remove)
  const reorderSections = useMutation(api.pageSections.reorder)

  const [items, setItems] = React.useState<Array<Section>>([])
  const [activeItem, setActiveItem] = React.useState<Section | null>(null)

  React.useEffect(() => {
    if (dbSections) {
      const mappedSections = dbSections.map((section: Doc<"pageSections">) => ({
        id: section._id,
        type: section.type,
        name: section.type,
        properties: section.content ?? {},
        position: section.orderIndex,
      }));
      setItems(mappedSections);

      if (activeItem) {
        const updatedActiveItem = mappedSections.find((item: Section) => item.id === activeItem.id);
        if (updatedActiveItem) setActiveItem(updatedActiveItem);
      }
    }
  }, [dbSections]);

  
  async function handleSectionUpdate(section: Section, action: 'add' | 'save' | 'delete') {
    const content: Record<string, unknown> = { ...(section.properties ?? {}) };
    delete content["sectionId"];
    const targetId: Id<'pageSections'> | undefined = section.id as Id<'pageSections'> | undefined;

    switch (action) {
      case 'add':
        await createSection({ landingPageId: pageId, type: section.type, content });
        break;
      case 'save':
        if (targetId) {
          await updateSection({ sectionId: targetId, content, type: section.type });
        }
        break;
      case 'delete':
        if (targetId) {
          await removeSection({ sectionId: targetId });
          setActiveItem(null);
        }
        break;
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!active || !over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => (i.id ?? i.type) === active.id)
    const newIndex = items.findIndex((i) => (i.id ?? i.type) === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = [...items]
    const [moved] = newOrder.splice(oldIndex, 1)
    if (!moved) return
    newOrder.splice(newIndex, 0, moved)
    setItems(newOrder)

    const payload = newOrder
      .filter((it) => Boolean(it.id))
      .map((it, idx) => ({ sectionId: it.id as unknown as Id<'pageSections'>, orderIndex: idx + 1 }))
    if (payload.length > 0) {
      await reorderSections({ landingPageId: pageId, ordered: payload })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
      <div className="lg:col-span-1">
        <SortableList
          items={items}
          onDragEnd={handleDragEnd}
          activeItem={activeItem}
          onItemClick={setActiveItem}
          onSectionUpdate={(s: Section) => handleSectionUpdate(s, 'add')}
        />
      </div>
      <div className="lg:col-span-2 border rounded-lg">
        <SectionEditor
          activeItem={activeItem}
          onSave={(section) => { void handleSectionUpdate(section, 'save') }}
          onDelete={(id: string) => {
            const current = activeItem ?? items.find((i) => i.id === id)
            if (!current) return
            void handleSectionUpdate({ ...current, id } as Section, 'delete')
          }}
          landingPageId={pageId}
        />
      </div>
    </div>
  )
}
