import type { DragEndEvent } from "@dnd-kit/core";
import type { LucideIcon } from "lucide-react";


export interface UsePageEditorService {
  config: Record<string, any> | null;
  items: Section[];
  activeItem: Section | null;
  landingPageExists: boolean | null;
  isLoading: boolean;
  currentSlug: string | null;
  setActiveItem: (item: Section | null) => void;
  setItems: (items: Section[]) => void;
  checkAndFetchConfig: () => Promise<void>;
  createLandingPage: () => Promise<void>;
  revalidateCurrentPage: () => Promise<void>;
}


export interface SectionEditorProps {
  activeItem: Section | null;
  onSave: (section: Section) => Promise<void> | void;
  onDelete: (sectionId: string) => void;
  landingPageId: string;
  currentSlug?: string | null;
}


export interface PropertyInputProps {
  keyName: string;
  value: any;
  path: string[];
  onChange: (key: string, value: any, path: string[]) => void;
  sectionId?: string;
}


export interface SortableListProps {
  items: Section[];
  onDragEnd: (event: DragEndEvent) => Promise<void> | void;
  activeItem: Section | null;
  onItemClick: (item: Section) => void;
  onSectionUpdate: (section: Section, action: 'save' | 'delete' | 'add') => Promise<void>;
}

export interface SortableItemProps {
  item: Section;
  isActive: boolean;
  onClick: () => void;
}

export interface DragHandleProps {
  id: string;
}

export interface AddSectionProps {
  items: Section[];
  onSectionUpdate: (section: Section, action: 'add') => void | Promise<void>;
}

export interface SectionDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  unique?: boolean;
}

export interface EditorPageProps {
  landingPageId: string;
} 

export interface ImagePattern {
  keys: readonly string[];
  valuePattern: RegExp;
}

export interface TypePatterns {
  theme: readonly string[];
  description: readonly string[];
  buttonUrl: readonly string[];
  icon: readonly string[];
  image: ImagePattern;
}

export interface Section {
  type: string;       
  id?: string;         
  name: string;        
  properties: Record<string, any>;
  position?: number;  
} 