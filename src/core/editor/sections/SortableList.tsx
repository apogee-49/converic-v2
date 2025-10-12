import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { Section, SortableListProps, DragHandleProps } from "./types";
import { Button } from "@/components/ui/button";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import baseline from '@/lib/baseline.json';
import { GripVerticalIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { sectionCategories } from "@/lib/config";
import { getSectionName, sectionUtils, sortObjectByBaseline } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


export const SortableList = ({ 
  items, 
  onDragEnd,
  activeItem,
  onItemClick,
  onSectionUpdate
}: SortableListProps) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 4 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    await onDragEnd(event);
  };

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col border rounded-md p-2">
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Keine Konfiguration gefunden.
        </div>
        <AddSection items={items} onSectionUpdate={onSectionUpdate} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border rounded-2xl p-3 bg-muted will-change-transform">
      <div className="flex-1 space-y-1 overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(({ id, type }) => id ?? type)} 
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => {
              const itemId = item.id ?? item.type;
              const isActive = (activeItem?.id ?? activeItem?.type) === itemId;
              return (
                <SortableItem
                  key={itemId}
                  item={item}
                  isActive={isActive}
                  onClick={() => onItemClick(item)}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
      <AddSection items={items} onSectionUpdate={onSectionUpdate} />
    </div>
  );
}; 


const DragHandle = ({ id }: DragHandleProps) => {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="h-6 w-6 cursor-grab active:cursor-grabbing"
    >
      <GripVerticalIcon className="h-3 w-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
};


const SortableItem = ({ item, isActive, onClick } : { item: Section; isActive: boolean; onClick: () => void }) => {
  const itemId = item.id ?? item.type;
  const { setNodeRef, transform, transition } = useSortable({ id: itemId });
  const sectionName = getSectionName(item.type);
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 p-2.5 bg-background rounded-lg border bg-card 
        cursor-pointer hover:border-primary/40 ${isActive ? 'border-primary/40 bg-primary/5' : ''}`}
      onClick={onClick}
    >
      <DragHandle id={itemId} />
      <div className="flex-1 text-sm font-medium">{sectionName}</div>
      <ChevronRightIcon className={`h-4 w-4 duration-200 ease-out ${isActive ? 'rotate-180' : ''}`} />
    </div>
  );
};


const createNewSection = (sectionId: string, items: Array<Section>): Section | null => {
  const baseConfig = (baseline as any)[sectionId];
  if (!baseConfig) return null;
  const newId = sectionUtils.getNextSectionId(sectionId, items);
  return {
    type: newId,
    name: sectionUtils.getSectionDisplayName(newId, getSectionName(sectionId)),
    properties: {
      ...sortObjectByBaseline(baseConfig, sectionId),
      sectionId: newId,
    },
  };
};


const AddSection = ({ items, onSectionUpdate} : {
  items: Array<Section>;
  onSectionUpdate: (section: Section, action: 'add') => void | Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddSection = async (sectionId: string) => {
    const newSection = createNewSection(sectionId, items);
    if (!newSection) return;
    await onSectionUpdate(newSection, 'add');
    setIsOpen(false);
  };

  const renderSectionCategories = () =>
    Object.entries(
      sectionCategories as Record<string, {
        title: string;
        sections: Array<{
          id: string;
          name: string;
          icon: LucideIcon;
          unique?: boolean;
        }>;
      }>
    )
      .map(([category, cat]) => (
        <div key={category} className="space-y-1">
          <div className="px-2 text-xs text-muted-foreground">
            {cat.title}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {cat.sections.map((section) => {
              const Icon = section.icon;
              const isDisabled = !sectionUtils.canAddSection(
                section.id,
                Boolean(section.unique),
                items,
              );
              return (
                <Button
                  key={section.id}
                  variant="ghost"
                  className="w-full justify-start px-2 text-sm gap-2"
                  disabled={isDisabled}
                  onClick={() => handleAddSection(section.id)}
                >
                  <Icon className="h-4 w-4" />
                  {section.name}
                </Button>
              );
            })}
          </div>
        </div>
      ));

  return (
    <div className="mt-auto pt-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button             variant="outline" 
            className="w-full py-[1.35rem] gap-2 text-muted-foreground bg-muted-foreground/10 border-muted-foreground/10 
            hover:text-muted-foreground hover:bg-muted-foreground/5 hover:border-muted-foreground/15 active:scale-none duration-none">
            <PlusIcon className="h-4 w-4" />
            Abschnitt hinzufügen
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <div className="space-y-3">
            {renderSectionCategories()}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};