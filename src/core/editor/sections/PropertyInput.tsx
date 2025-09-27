"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCamelCase } from "@/lib/utils";
import type { PropertyInputProps } from "./types";
import { PlusCircle, Trash2Icon, ImageIcon, ChartNoAxesGantt, PaintbrushIcon } from "lucide-react";
import { IconPicker, Icon, type IconName } from "@/components/ui/icon-picker";

type FieldType = 'image' | 'theme' | 'beschreibung' | 'buttonUrl' | 'boolean' | 'array' | 'object' | 'text' | 'icon';

const getFieldType = (keyName: string, value: any): FieldType => {
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'object';

  const keyMap: Record<string, FieldType> = {
    bild: 'image',
    theme: 'theme',
    beschreibung: 'beschreibung',
    buttonurl: 'buttonUrl',
    icon: 'icon'
  };

  return keyMap[keyName.toLowerCase()] ?? 'text';
};

const ImageField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{formatCamelCase(keyName)}</label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const url = window.prompt('Bild-URL eingeben', value ?? '');
            if (url !== null) onChange(keyName, url, path);
          }}
          className="gap-2"
        >
          <ImageIcon className="w-4 h-4" /> {value ? "Bild ändern" : "Bild auswählen"}
        </Button>
        {value && (
          <span className="text-xs text-muted-foreground truncate max-w-[20ch]">{value}</span>
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
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{formatCamelCase(keyName)}:</label>
      <div className="inline-flex p-1 border rounded-md">
        {themes.map((theme) => (
          <label
            key={theme.value}
            className={`flex-1 flex items-center justify-center px-3 py-1 text-sm rounded-md cursor-pointer ${value === theme.value ? 'bg-accent' : ''}`}
          >
            <input
              type="radio"
              name={`theme-${path.join('-')}-${keyName}`}
              value={theme.value}
              checked={value === theme.value}
              onChange={(e) => handleChange(e.target.value)}
              className="sr-only"
            />
            <theme.Icon className="w-4 h-4 mr-1" />
            {theme.label}
          </label>
        ))}
      </div>
    </div>
  );
};

const BooleanField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  const id = `switch-${path.join('-')}-${keyName}`;
  return (
    <div className="mb-4 flex items-center gap-2">
      <Switch
        id={id}
        checked={!!value}
        onCheckedChange={(checked: boolean) => onChange(keyName, !!checked, path)}
      />
      <Label htmlFor={id}>{formatCamelCase(keyName)}</Label>
    </div>
  );
};

const TextField = ({ keyName, value, onChange, path, isMultiline = false, isButtonUrl = false }: PropertyInputProps & { isMultiline?: boolean, isButtonUrl?: boolean }) => {
  return (
    <div className="mb-3">
      <label className="block mb-1 text-sm font-medium">{formatCamelCase(keyName)}:</label>
      {isMultiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(keyName, e.target.value, path)}
          className="w-full p-2 border rounded-md text-sm"
          rows={3}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(keyName, e.target.value, path)}
        />
      )}
      {isButtonUrl && (
        <div className="mt-1 text-xs text-muted-foreground">Um zurück zum Funnel zu kommen gebe #form ein.</div>
      )}
    </div>
  );
};

const ArrayField = ({ keyName, value, path, onChange, sectionId }: PropertyInputProps) => {
  const canAddItems = !['steps'].includes(sectionId ?? '');

  const addNewItem = () => {
    const template = value[0];
    const newItem = typeof template === 'object' && template !== null
      ? Object.fromEntries(Object.entries(template).map(([k, v]) => [k, typeof v === 'object' ? Array.isArray(v) ? [] : {} : '']))
      : '';
    onChange(keyName, [...value, newItem], path);
  };

  const removeItem = (index: number) => {
    const newArray = [...value];
    newArray.splice(index, 1);
    onChange(keyName, newArray, path);
  };

  const updateArrayItem = (index: number, itemValue: any) => {
    const newArray = [...value];
    newArray[index] = itemValue;
    onChange(keyName, newArray, path);
  };

  return (
    <div className="mb-4">
      <div className="mb-1 text-sm font-medium">{formatCamelCase(keyName)}</div>
      <div className="space-y-2">
        {value.map((item: any, index: number) => (
          <div key={index} className="border rounded-md p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Element {index + 1}</span>
              {canAddItems && (
                <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              )}
            </div>
            {typeof item === 'object' && item !== null ? (
              Object.entries(item).map(([k, v]) => (
                <PropertyInput
                  key={`${index}-${k}`}
                  keyName={k}
                  value={v}
                  path={[...path, keyName, index.toString()]}
                  onChange={onChange}
                  sectionId={sectionId}
                />
              ))
            ) : (
              <Input value={item} onChange={(e) => updateArrayItem(index, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      {canAddItems && (
        <Button variant="ghost" size="sm" onClick={addNewItem} className="mt-2 gap-2">
          <PlusCircle className="w-4 h-4" /> Element hinzufügen
        </Button>
      )}
    </div>
  );
};

const ObjectField = ({ keyName, value, path, onChange, sectionId }: PropertyInputProps) => {
  return (
    <div className="mb-3">
      <div className="mb-1 text-sm font-semibold">{formatCamelCase(keyName)}:</div>
      <div className="pl-2">
        {Object.entries(value).map(([k, v]) => (
          <PropertyInput
            key={k}
            keyName={k}
            value={v}
            path={[...path, keyName]}
            onChange={onChange}
            sectionId={sectionId}
          />
        ))}
      </div>
    </div>
  );
};

const IconField = ({ keyName, value, onChange, path }: PropertyInputProps) => {
  const isInList = path.length > 0;
  
  const handleIconChange = (iconName: IconName) => {
    onChange(keyName, iconName, path);
  };

  return (
    <div className={`space-y-2 ${isInList ? 'mb-3' : ''}`}>
      <label className="text-sm font-medium">{formatCamelCase(keyName)}</label>
      <div className="flex items-center gap-2">
        {value && (
          <div className="w-8 h-8 border rounded-md flex items-center justify-center">
            <Icon name={value as IconName} className="w-4 h-4" />
          </div>
        )}
        <IconPicker
          value={value as IconName}
          onValueChange={handleIconChange}
          triggerPlaceholder="Icon auswählen"
        >
          <Button variant="outline" size="sm" className="gap-2">
            {value ? "Icon ändern" : "Icon auswählen"}
          </Button>
        </IconPicker>
      </div>
    </div>
  );
};

export const PropertyInput = (props: PropertyInputProps) => {
  const { keyName, value } = props;
  const fieldType = getFieldType(keyName, value);
  
  switch (fieldType) {
    case 'image':
      return <ImageField {...props} />;
    case 'theme':
      return <ThemeField {...props} />;
    case 'icon':
      return <IconField {...props} />;
    case 'boolean':
      return <BooleanField {...props} />;
    case 'array':
      return <ArrayField {...props} />;
    case 'object':
      return <ObjectField {...props} />;
    case 'beschreibung':
      return <TextField {...props} isMultiline={true} />;
    case 'buttonUrl':
      return <TextField {...props} isButtonUrl={true} />;
    case 'text':
    default:
      return <TextField {...props} />;
  }
}; 