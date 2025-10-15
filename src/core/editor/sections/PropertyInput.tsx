"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCamelCase, formatBytes } from "@/lib/utils";
import baseline from "@/lib/baseline.json";
import type { PropertyInputProps } from "./types";
import { PlusCircle, Trash2Icon, ImageIcon, Upload, ExternalLinkIcon, UnfoldVertical, MonitorSmartphoneIcon, MonitorIcon, ChartNoAxesGantt, MousePointerClickIcon, PaintbrushIcon, GripVerticalIcon, ChevronRightIcon, InfoIcon, ListCheckIcon } from "lucide-react";
import { Rating, RatingButton } from "@/components/ui/rating";
import { IconPicker, Icon, type IconName } from "@/components/ui/icon-picker";
import { FileManagerDialog } from "@/components/dialog/file-manager";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DndContext, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect, type ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type FieldType = 'image' | 'theme' | 'beschreibung' | 'buttonUrl' | 'link' | 'boolean' | 'array' | 'object' | 'text' | 'icon' | 'rating' | 'color' | 'padding' | 'pixel';

const BUTTON_KEYS = ["buttonText", "buttonText1", "buttonText2", "buttonUrl", "pfeil", "buttonIcon"] as const;
const isButtonKey = (k: string) => (BUTTON_KEYS as readonly string[]).includes(k);

const PADDING_KEYS = ["topPadding", "bottomPadding"] as const;
const isPaddingKey = (k: string) => (PADDING_KEYS as readonly string[]).includes(k);

const FIELD_KEY_TO_TYPE: Record<string, FieldType> = {
  bild: 'image',
  logo: 'image',
  theme: 'theme',
  beschreibung: 'beschreibung',
  inhalt: 'beschreibung',
  buttonurl: 'buttonUrl',
  link: 'link',
  icon: 'icon',
  buttonicon: 'icon',
  stars: 'rating',
  toppadding: 'padding',
  bottompadding: 'padding',
  imagesize: 'pixel',
};

const getFieldType = (keyName: string, value: any): FieldType => {
  const mapped = FIELD_KEY_TO_TYPE[keyName.toLowerCase()];
  if (mapped) return mapped;
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  if (value !== null && typeof value === 'object') return 'object';
  return 'text';
};



const ImageField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  const imageUrl: string = value?.url ?? "";
  const fileMeta: { fileName?: string; size?: number } | null = value?.meta ?? null;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isInArray = path.some((segment) => /^[0-9]+$/.test(String(segment)));
  const visibleValue: string | undefined = (value as any)?.visible;

  const handleChange = () => {
    setIsDialogOpen(true);
  };

  const formatFileName = (name: string): string => {
    if (!name) return "";
    const [firstSegment, ...rest] = name.split("_");
    if (rest.length === 0) return name;
    return /^\d+$/.test(firstSegment ?? "") ? rest.join("_") : name;
  };

  const fileName = formatFileName(fileMeta?.fileName ?? "");
  const fileSizeLabel = fileMeta?.size ? formatBytes(fileMeta.size) : "";

  const handleOpenInNewTab = () => {
    if (!imageUrl) return;
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`flex flex-col ${isInArray ? "" : "border-t pt-6 mt-3"} gap-4`}>
      {!isInArray && (
        <Label className="text-md font-medium text-foreground flex items-center gap-2 -mb-1">
          <ImageIcon className="w-4 h-4" /> {keyName === 'logo' ? 'Logo' : 'Bild'}
        </Label>
      )}
      <div className="flex items-start gap-6">
        <div
          className="w-38 h-38 rounded-lg bg-background border-1 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90"
          onClick={handleChange}
        >
          {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt="Bild Vorschau" 
                className="w-full h-full object-cover"
                style={{
                  objectFit: (fileName?.endsWith('.svg') ?? fileName?.endsWith('.ico')) ? 'contain' : 'cover',
                  margin: (fileName?.endsWith('.svg') ?? fileName?.endsWith('.ico')) ? '1rem' : '0'
                }}
                width={152} 
                height={152} 
                unoptimized 
              />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-3 justify-center my-auto">
          <div className="text-sm flex flex-col gap-2">
            <div className="text-muted-foreground font-medium text-xs">Ausgewählt:</div>
            <div className="inline-block rounded-md bg-muted w-fit px-4 py-2 text-sm font-medium">
              {fileName || "Kein Bild ausgewählt"}
              {fileMeta && (
                <span className="text-muted-foreground ml-2 text-xs font-medium">
                  {fileSizeLabel}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
          <div className="text-muted-foreground font-medium text-xs">Optionen:</div>
            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="outline" size="sm" onClick={handleChange} className="gap-2">
                <Upload className="w-4 h-4 text-foreground" />Bild ändern
              </Button>
              {typeof visibleValue !== "undefined" && (
                <div className="flex items-center gap-2">
                  <Select
                    value={typeof visibleValue === "string" ? visibleValue : "both"}
                    onValueChange={(newValue) => {
                      const next = { ...(value ?? {}), visible: newValue };
                      onChange(keyName, next, path);
                    }}
                  >
                    <SelectTrigger size="default" className="w-fit cursor-pointer shadow-none font-medium">
                      <SelectValue placeholder="Sichtbarkeit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">
                        <MonitorSmartphoneIcon className="w-4 h-4 text-foreground" />Desktop & Mobile</SelectItem>
                      <SelectItem value="desktop">
                        <MonitorIcon className="w-4 h-4 text-foreground" />Nur Desktop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {imageUrl && (
                <>
                  <Button variant="outline" size="sm" onClick={handleOpenInNewTab} className="gap-2 xl:flex hidden">
                    <ExternalLinkIcon className="w-4 h-4 text-foreground" />Link
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <FileManagerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSelectImage={(
          url: string,
          selectedId?: string,
          fileInfo?: { fileName?: string; size?: number },
        ) => {
          const next = fileInfo && selectedId
            ? { url, meta: { fileName: fileInfo.fileName ?? "", size: fileInfo.size ?? 0 } }
            : { url };
          onChange(keyName, next, path);
        }}
        currentImage={imageUrl}
      />
    </div>
  );
};
const PixelField = (props: PropertyInputProps) => {
  const { keyName, value, onChange, path } = props;
  const lower = keyName.toLowerCase();
  const max = lower === 'imagesize' ? 100 : (lower === 'toppadding' || lower === 'bottompadding') ? 50 : 100;
  const min = 0;
  const numeric = typeof value === 'number' ? value : parseInt(String(value ?? 0).replace(/[^\d-]/g, ''), 10) || 0;
  const set = (n: number) => onChange(keyName, `${Math.max(min, Math.min(max, Math.round(n)))}px`, path);
  return (
    <div className="flex flex-col gap-3">
      <Label>{keyName.toLowerCase() === 'imagesize' ? 'Logo Größe' : formatCamelCase(keyName)}</Label>
      <div className="flex items-center gap-2">
        <Slider className="w-42 mr-1" value={[numeric]} min={min} max={max} onValueChange={(vals) => set(vals[0] ?? 0)} />
        <Input type="text" value={numeric} onChange={(e) => set(Number(e.target.value))} className="h-8 px-2 w-11" />
        <span className="text-xs text-muted-foreground">px</span>
      </div>
    </div>
  );
};

export const PaddingGroupField = ({ value, onChange, path }: { value: Record<string, any>; onChange: PropertyInputProps["onChange"]; path: string[]; }) => {
  const hasTop = Object.prototype.hasOwnProperty.call(value, "topPadding");
  const hasBottom = Object.prototype.hasOwnProperty.call(value, "bottomPadding");
  if (![hasTop, hasBottom].some(Boolean)) return null;

  return (
    <div className="flex flex-col border-t pt-6 mt-3 gap-5">
      <Label className="text-md font-medium text-foreground flex items-center gap-2">
        <UnfoldVertical className="w-4 h-4" />
        Padding
      </Label>
      <div className="flex flex-col gap-4">
        {hasTop && (
          <PixelField keyName="topPadding" value={value.topPadding} onChange={onChange} path={path} />
        )}
        {hasBottom && (
          <PixelField keyName="bottomPadding" value={value.bottomPadding} onChange={onChange} path={path} />
        )}
      </div>
    </div>
  );
};


const ThemeField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  const themes = [
    { label: 'Simple', value: 'theme-1', Icon: ChartNoAxesGantt },
    { label: 'Kreativ', value: 'theme-2', Icon: PaintbrushIcon },
  ];

  const handleChange = (newValue: string) => onChange(keyName, newValue, path);

  return (
    <div className="flex flex-col gap-2">
      <Label className="block text-sm font-medium">{formatCamelCase(keyName)}</Label>
      <Tabs value={(typeof value === 'string' && value) ? value : 'theme-1'} onValueChange={handleChange}>
        <TabsList className="border border-border rounded-lg h-10">
          {themes.map((theme) => (
            <TabsTrigger key={theme.value} value={theme.value} className="gap-1.5 py-2 px-3 cursor-pointer shadow-none">
              <theme.Icon className="w-4 h-4" />
              {theme.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

const BooleanField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  const id = `switch-${path.join('-')}-${keyName}`;
  return (
    <div className="flex items-center gap-2">
      <Switch
        id={id}
        checked={!!value}
        onCheckedChange={(checked: boolean) => onChange(keyName, !!checked, path)}
      />
      <Label htmlFor={id}>{formatCamelCase(keyName)}</Label>
    </div>
  );
};

const RatingField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  const ratingValue = typeof value === 'number' ? value : 0;
  return (
    <div className="flex flex-col gap-2">
      <Label className="block text-sm font-medium">Sterne Bewertung</Label>
      <Rating
        value={ratingValue}
        onValueChange={(newValue: number) => onChange(keyName, newValue, path)}
        className="gap-1"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <RatingButton className="text-primary border rounded-md p-2.5" key={index} />
        ))}
      </Rating>
    </div>
  );
};

const TextField = ({ keyName, value, onChange, path, isMultiline = false, isButtonUrl = false, isLink = false }: PropertyInputProps & { isMultiline?: boolean, isButtonUrl?: boolean, isLink?: boolean }) => {
  return (
    <div className="flex flex-col gap-2">
      <Label className="block text-sm font-medium">
        {keyName === 'buttonText' ? 'Text' : 
         keyName === 'buttonText1' ? 'Text 1' : 
         keyName === 'buttonText2' ? 'Text 2' : 
         isButtonUrl || isLink ? 'Link' : formatCamelCase(keyName)}
      </Label>
      {isMultiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(keyName, e.target.value, path)}
          className="w-full border rounded-md"
          rows={3}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(keyName, e.target.value, path)}
        />
      )}
      {isButtonUrl && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <InfoIcon className="w-3.5 h-3.5" />
          Um zurück zum Funnel zu kommen geben Sie <span className="bg-muted border rounded-sm px-1">#form</span> ein.
        </div>
      )}
      {isLink && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <InfoIcon className="w-3.5 h-3.5" />
          Um eine Telefonnummer zu verlinken geben Sie <span className="bg-muted border rounded-sm px-1">tel:</span> ein.
        </div>
      )}
    </div>
  );
};

export const ButtonGroupField = ({ value, onChange, path }: { value: Record<string, any>; onChange: PropertyInputProps["onChange"]; path: string[]; }) => {
  const hasButtonText = Object.prototype.hasOwnProperty.call(value, "buttonText")
    || Object.prototype.hasOwnProperty.call(value, "buttonText1")
    || Object.prototype.hasOwnProperty.call(value, "buttonText2");
  const hasButtonUrl = Object.prototype.hasOwnProperty.call(value, "buttonUrl");
  const hasPfeil = Object.prototype.hasOwnProperty.call(value, "pfeil");
  const hasButtonIcon = Object.prototype.hasOwnProperty.call(value, "buttonIcon");
  const hasLink = Object.prototype.hasOwnProperty.call(value, "link");

  if (![hasButtonText, hasButtonUrl, hasPfeil].some(Boolean)) return null;

  return (
    <div className="flex flex-col border-t pt-6 mt-3 gap-4">
      <Label className="text-md font-medium text-foreground flex items-center gap-2">
        <MousePointerClickIcon className="w-4 h-4" />
        Button
      </Label>
      <div className="flex flex-col gap-5">
        {Object.entries(value).filter(([k]) => ["buttonText", "buttonText1", "buttonText2"].includes(k)).map(([k]) => (
          <TextField
            key={k}
            keyName={k}
            value={value[k]}
            onChange={onChange}
            path={path}
          />
        ))}
        {hasButtonUrl && (
          <TextField
            keyName="buttonUrl"
            value={value.buttonUrl}
            onChange={onChange}
            path={path}
            isButtonUrl={true}
          />
        )}
        {hasLink && (
          <TextField
            keyName="link"
            value={value.link}
            onChange={onChange}
            path={path}
            isLink={true}
          />
        )}
        {hasButtonIcon && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Icon</Label>
            <div className="flex items-center gap-2">
              <IconPicker
                value={value.buttonIcon as IconName}
                onValueChange={(icon) => onChange("buttonIcon", icon, path)}
                triggerPlaceholder="Icon auswählen"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  {value.buttonIcon && (
                    <Icon name={value.buttonIcon as IconName} className="w-4 h-4" />
                  )}
                  {value.buttonIcon ? String(value.buttonIcon) : "Icon auswählen"}
                </Button>
              </IconPicker>
            </div>
          </div>
        )}
        {hasPfeil && (
          <BooleanField
            keyName="pfeil"
            value={!!value.pfeil}
            onChange={onChange}
            path={path}
          />
        )}
      </div>
    </div>
  );
};

const ObjectField = ({ keyName, value, path, onChange, sectionId }: PropertyInputProps) => {
  const objectPath = [...path, keyName];
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-semibold">{formatCamelCase(keyName)}</Label>
      <div className="pl-2">
        {Object.entries(value)
          .filter(([k]) => !isButtonKey(k) && !isPaddingKey(k))
          .map(([k, v]) => (
            <PropertyInput
              key={k}
              keyName={k}
              value={v}
              path={objectPath}
              onChange={onChange}
              sectionId={sectionId}
            />
          ))}
        <ButtonGroupField value={value as Record<string, any>} onChange={onChange} path={objectPath} />
        <PaddingGroupField value={value as Record<string, any>} onChange={onChange} path={objectPath} />
      </div>
    </div>
  );
};

const IconField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  
  const handleIconChange = (iconName: IconName) => {
    onChange(keyName, iconName, path);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{formatCamelCase(keyName)}</Label>
      <div className="flex items-center gap-2">
        <IconPicker
          value={value as IconName}
          onValueChange={handleIconChange}
          triggerPlaceholder="Icon auswählen"
        >
          <Button variant="outline" size="sm" className="gap-2">
          {value && (
            <Icon name={value as IconName} className="w-4 h-4" />
        )}
            {value ? `${value}` : "Icon auswählen"}
          </Button>
        </IconPicker>
      </div>
    </div>
  );
};



const SortableArrayItem = ({ 
  id,
  label,
  expanded,
  onToggle,
  onRemove,
  children,
}: {
  id: string;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  children: ReactNode;
}) => {
  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-lg bg-muted border border-border"
    >
      <div
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer justify-between rounded-lg ${
          expanded ? 'border-b pb-5 -mb-5' : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVerticalIcon className="h-3 w-3 text-muted-foreground" />
            <span className="sr-only">Ziehen zum Sortieren</span>
          </Button>
          <div className="flex-1 text-sm truncate">{label}</div>
          <ChevronRightIcon 
            className={`h-4 w-4 duration-200 ease-out ${expanded ? 'rotate-270' : 'rotate-90'}`} 
          />
        </div>
        <Button 
          variant="ghost" 
          className="hover:text-destructive hover:bg-transparent disabled:opacity-50"
          disabled={!onRemove}
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <Trash2Icon className="h-3 w-3" />
        </Button>
      </div>
      {expanded && (
        <div className="p-5 flex flex-col gap-4 bg-card rounded-lg border border-border m-1">
          {children}
        </div>
      )}
    </div>
  );
};

const ArrayField = ({ keyName, value, path, onChange, sectionId }: PropertyInputProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const canAddItems = !['steps'].includes(sectionId ?? '');

  const genId = () => Math.random().toString(36).slice(2, 10);
  const [itemIds, setItemIds] = useState<string[]>(() => (value as Array<any>).map(() => genId()));

  useEffect(() => {
    setItemIds((prev) => {
      if (prev.length === (value as Array<any>).length) return prev;
      const next = prev.slice(0, (value as Array<any>).length);
      while (next.length < (value as Array<any>).length) next.push(genId());
      return next;
    });
  }, [value.length]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 4 } })
  );

  const addNewItem = () => {
    const template = value[0];
    const newItem = typeof template === 'object' && template !== null
      ? Object.fromEntries(Object.entries(template).map(([k, v]) => [k, typeof v === 'object' ? Array.isArray(v) ? [] : {} : '']))
      : '';
    const next = [...value, newItem];
    onChange(keyName, next, path);
    const newId = genId();
    setItemIds((prev) => [...prev, newId]);
    setExpandedIds(new Set([...expandedIds, newId]));
  };

  const removeById = (id: string) => {
    const index = itemIds.indexOf(id);
    if (index === -1) return;
    const next = [...value];
    next.splice(index, 1);
    onChange(keyName, next, path);
    setItemIds((prev) => prev.filter((_, i) => i !== index));
    const nextExpanded = new Set(expandedIds);
    nextExpanded.delete(id);
    setExpandedIds(nextExpanded);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = itemIds;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(value, oldIndex, newIndex);
    onChange(keyName, reordered, path);
    setItemIds((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (expandedIds.has(id)) {
      const next = new Set(expandedIds);
      next.delete(id);
      setExpandedIds(next);
    }
  };

  const hasObjects = value.some((item: any) => typeof item === 'object' && item !== null && !Array.isArray(item));

  const getItemLabel = (item: any): string => {
    return item?.titel ?? item?.title ?? item?.name ?? item?.stichpunkt ?? item?.frage ?? '';
  };

  const getBaselineKeysForArrayItem = (): Array<string> => {
    const baseId = (sectionId ?? '').split('-')[0] ?? '';
    const base: Record<string, any> = baseline as unknown as Record<string, any>;
    let template: any = null;
    if (baseId && Array.isArray(base[baseId]?.[keyName])) {
      template = base[baseId][keyName][0];
    }
    if (!template) {
      for (const value of Object.values(base)) {
        if (Array.isArray((value as any)?.[keyName]) && (value as any)[keyName][0]) {
          template = (value as any)[keyName][0];
          break;
        }
      }
    }
    return template && typeof template === 'object' ? Object.keys(template as Record<string, unknown>) : [];
  };

  const baselineKeys = getBaselineKeysForArrayItem();

  return (
    <div className="flex flex-col border-t pt-6 mt-3 ">
      <Label className="text-md font-medium mb-3 flex items-center gap-2">
        <ListCheckIcon className="w-4 h-4" />
        {formatCamelCase(keyName)}
      </Label>
      <div className="space-y-2">
        {hasObjects ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext 
              items={itemIds}
              strategy={verticalListSortingStrategy}
            >
              {(value as Array<any>).map((item: any, index: number) => {
                const id = itemIds[index] ?? genId();
                const label = getItemLabel(item);
                const itemKeys = Object.keys(item);
                const orderedKeys = [
                  ...baselineKeys.filter((k) => itemKeys.includes(k)),
                  ...itemKeys.filter((k) => !baselineKeys.includes(k)).sort(),
                ];
                return (
                  <SortableArrayItem
                    key={id}
                    id={id}
                    label={label}
                    expanded={expandedIds.has(id)}
                    onToggle={() => toggleExpanded(id)}
                    onRemove={canAddItems ? () => removeById(id) : undefined}
                  >
                    {orderedKeys.map((k) => (
                      <PropertyInput
                        key={`${id}-${k}`}
                        keyName={k}
                        value={item[k]}
                        path={[...path, keyName, index.toString()]}
                        onChange={onChange}
                        sectionId={sectionId}
                      />
                    ))}
                  </SortableArrayItem>
                );
              })}
            </SortableContext>
          </DndContext>
        ) : (
          value.map((item: any, index: number) => {
            const updateArrayItem = (itemValue: any) => {
              const newArray = [...value];
              newArray[index] = itemValue;
              onChange(keyName, newArray, path);
            };
            return (
              <div key={index} className="border rounded-md p-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{getItemLabel({ title: String(item) })}</span>
                  {canAddItems && (
                    <Button variant="ghost" size="icon" onClick={() => {
                      const id = itemIds[index];
                      if (id) removeById(id);
                    }}>
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Input value={item} onChange={(e) => updateArrayItem(e.target.value)} />
              </div>
            );
          })
        )}
      </div>
      {canAddItems && (
        <Button variant="ghost" size="sm" onClick={addNewItem} className="w-fit text-primary hover:text-primary">
          <PlusCircle className="w-4 h-4" /> Element hinzufügen
        </Button>
      )}
    </div>
  );
};

export const PropertyInput = (props: PropertyInputProps) => {
  const { keyName, value, onChange, path } = props;
  const fieldType = getFieldType(keyName, value);
  
  switch (fieldType) {
    case 'image':
      return <ImageField {...props} />;
    case 'theme':
      return <ThemeField {...props} />;
    case 'icon':
      return <IconField {...props} />;
    case 'pixel': 
      return <PixelField {...props} />;
    case 'boolean':
      return <BooleanField {...props} />;
    case 'array':
      return <ArrayField {...props} />;
    case 'object':
      return <ObjectField {...props} />;
    case 'rating':
      return <RatingField {...props} />;
    case 'beschreibung':
      return <TextField {...props} isMultiline={true} />;
    case 'buttonUrl':
      return <TextField {...props} isButtonUrl={true} />;
    case 'text':
    default:
      return <TextField {...props} />;
  }
}; 