import React, { useLayoutEffect, useState, useMemo } from 'react';
import type { SectionEditorProps } from './types';
import { PropertyInput } from './PropertyInput';
import { ButtonGroupField } from './PropertyInput';
import { Button } from "@/components/ui/button";
import { SaveIcon, Trash2Icon, Loader } from 'lucide-react';
import { getSectionName, sortObjectByBaseline } from '@/lib/utils';

const SectionEditorEmptyState = () => (
  <div className="p-2 flex items-center justify-center h-full text-sm text-muted-foreground">
    Keine Section ausgewählt.
  </div>
);

const EditorHeader = ({ 
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
    <div className="shrink-0 flex bg-muted justify-between items-center border rounded-b-2xl px-4 sm:px-8 pt-8 pb-4 -mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          className="gap-2"
          onClick={onSave}
          disabled={isDisabled}
        >
          {isSaving && <Loader className="w-4 h-4 animate-spin" />}
          {!isSaving && <SaveIcon className="w-4 h-4" />}
          {isSaving ? "Speichern..." : hasChanges ? "Speichern" : "Gespeichert"}
        </Button>
        <Button
          variant="outline"
          onClick={() => onDelete()}
          aria-label="Abschnitt löschen"
          disabled={isSaving}
        >
          <Trash2Icon className="w-4 h-4" />
          Löschen
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
}) => {
  const hasButtonGroup =
    Object.prototype.hasOwnProperty.call(properties, 'buttonText') ||
    Object.prototype.hasOwnProperty.call(properties, 'buttonUrl') ||
    Object.prototype.hasOwnProperty.call(properties, 'pfeil');

  const sortedEntries = Object.entries(sortObjectByBaseline(properties, sectionType))
    .filter(([key]) => key !== "sectionId");

  return (
    <div className="flex-1 relative border rounded-2xl bg-background">
      <div className="absolute inset-0 overflow-y-auto px-4 py-6 sm:p-8 gap-x-6 gap-y-8">
        <div className="flex flex-col gap-5">
          {sortedEntries
            .filter(([key]) => !(key === 'buttonText' || key === 'buttonUrl' || key === 'pfeil'))
            .map(([key, value]) => (
              <PropertyInput
                key={`${sectionId}-${key}`}
                keyName={key}
                value={value}
                onChange={onChange}
                path={[]}
                sectionId={sectionType}
              />
            ))}
          {hasButtonGroup && (
            <ButtonGroupField value={properties} onChange={onChange} path={[]} />
          )}
        </div>
      </div>
    </div>
  );
};

export const SectionEditor: React.FC<SectionEditorProps> = ({ 
  activeItem, 
  onSave, 
  onDelete,
}) => {
  const [properties, setProperties] = useState<Record<string, any>>({});
  const [originalProperties, setOriginalProperties] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);


  useLayoutEffect(() => {
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
      <EditorContent
        properties={properties}
        sectionId={activeItem.id ?? `${activeItem.type}-${activeItem.position ?? ''}`}
        sectionType={activeItem.type}
        onChange={updateProperties}
      />
      <EditorHeader
        title={getSectionName(activeItem.type)}
        hasChanges={hasChanges}
        onSave={saveChanges}
        onDelete={deleteSection}
        isSaving={isSaving}
      />
    </div>
  );
}; 