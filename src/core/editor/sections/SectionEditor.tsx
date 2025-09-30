import React, { useEffect, useState, useMemo } from 'react';
import type { SectionEditorProps } from './types';
import { PropertyInput } from './PropertyInput';
import { Button } from "@/components/ui/button";
import { PencilIcon, ArrowRight, Trash2Icon, Loader2 } from 'lucide-react';
import { getSectionName, sortObjectByBaseline } from '@/lib/utils';

const SectionEditorEmptyState = () => (
  <div className="p-2 flex items-center justify-center h-full text-sm text-muted-foreground">
    Keine Section ausgewählt.
  </div>
);

const EditorHeader = ({ 
  title, 
  hasChanges, 
  onSave, 
  onDelete,
  isSaving = false
}: { 
  title: string;
  hasChanges: boolean;
  onSave: () => void;
  onDelete: () => void;
  isSaving?: boolean;
}) => {
  const isDisabled = isSaving || !hasChanges;
  return (
    <div className="shrink-0 flex justify-between items-center border rounded-md px-3 py-3 mt-3 mx-3">
      <div className="flex items-center gap-2">
        <PencilIcon className="w-4 h-4" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete()}
          aria-label="Abschnitt löschen"
          disabled={isSaving}
        >
          <Trash2Icon className="w-4 h-4" />
        </Button>
        <Button
          variant="default"
          className="text-sm gap-2"
          onClick={onSave}
          disabled={isDisabled}
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? "Speichern..." : hasChanges ? "Speichern" : "Gespeichert"}
          {!isSaving && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

const EditorContent = ({ 
  properties, 
  sectionId,
  sectionType, 
  onChange 
}: { 
  properties: Record<string, any>;
  sectionId: string;
  sectionType: string;
  onChange: (key: string, value: any, path: string[]) => void;
}) => (
  <div className="flex-1 relative">
    <div className="absolute inset-0 overflow-y-auto p-3">
      <div className="space-y-3">
        {Object.entries(sortObjectByBaseline(properties, sectionType))
          .filter(([key]) => key !== "sectionId")
          .map(([key, value]) => (
            <PropertyInput
              key={`${sectionId}-${key}`}
              keyName={key}
              value={value}
              onChange={onChange}
              path={[]}
              sectionId={sectionId}
            />
          ))
        }
      </div>
    </div>
  </div>
);

export const SectionEditor: React.FC<SectionEditorProps> = ({ 
  activeItem, 
  onSave, 
  onDelete,
}) => {
  const [properties, setProperties] = useState<Record<string, any>>({});
  const [originalProperties, setOriginalProperties] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    if (activeItem) {
      const initialProps = { ...activeItem.properties };
      setProperties(initialProps);
      setOriginalProperties(initialProps);
    }
  }, [activeItem]);

  const hasChanges = useMemo(() => 
    JSON.stringify(properties) !== JSON.stringify(originalProperties),
    [properties, originalProperties]
  );


  const updateProperties = (key: string, value: any, path: string[] = []) => {
    setProperties((prevProps) => {
      const newProperties = structuredClone(prevProps);
      
      let current = newProperties;
      for (let i = 0; i < path.length; i++) {
        const currentKey = String(path[i]);
        
        if (!(currentKey in current) || current[currentKey] == null) {
          const nextKey = path[i + 1];
          current[currentKey] = /^\d+$/.test(String(nextKey)) ? [] : {};
        }
        
        current = current[currentKey];
      }
      
      current[key] = value;
      return newProperties;
    });
  };
  

  const saveChanges = async () => {
    if (!activeItem || isSaving) return;

    setIsSaving(true);
    try {
      await onSave({ ...activeItem, properties });
      setOriginalProperties(properties);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  
  const deleteSection = () => {
    if (activeItem) {
      onDelete(activeItem.id ?? activeItem.type);
    }
  };

  if (!activeItem) {
    return <SectionEditorEmptyState />;
  }

  return (
    <div className="h-full flex flex-col">
      <EditorHeader
        title={getSectionName(activeItem.type)}
        hasChanges={hasChanges}
        onSave={saveChanges}
        onDelete={deleteSection}
        isSaving={isSaving}
      />
      <EditorContent
        properties={properties}
        sectionId={activeItem.id ?? `${activeItem.type}-${activeItem.position ?? ''}`}
        sectionType={activeItem.type}
        onChange={updateProperties}
      />
    </div>
  );
}; 