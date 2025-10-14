import type { LucideIcon } from "lucide-react";
import {
  PanelTopCloseIcon, LayoutList, ListOrderedIcon, Heading1Icon,
  GalleryHorizontalEndIcon, LetterTextIcon, MessageCircleQuestionIcon,
  StarIcon, Filter, MousePointerClickIcon, MessageSquareQuote
} from "lucide-react";

export type SectionDef = {
  id: string;
  name: string;
  icon: LucideIcon;
  unique?: boolean;
};

export type Category = {
  title: string;
  sections: Array<SectionDef>;
};

export const sectionCategories: Record<string, Category> = {
  STRUCTURE: {
    title: "Struktur",
    sections: [
      { id: "header", name: "Kopfzeile", icon: PanelTopCloseIcon, unique: true },
      { id: "hero", name: "Hero", icon: Heading1Icon, unique: true },
    ],
  },
  CONTENT: {
    title: "Content",
    sections: [
      { id: "benefits", name: "Features", icon: LayoutList },
      { id: "steps", name: "Schritte", icon: ListOrderedIcon },
      { id: "images", name: "Bilder", icon: GalleryHorizontalEndIcon },
      { id: "about", name: "Über uns", icon: LetterTextIcon },
      { id: "faq", name: "FAQ", icon: MessageCircleQuestionIcon },
      { id: "trust", name: "Trust Bar", icon: StarIcon },
    ],
  },
  INTERACTIVE: {
    title: "Interaktiv",
    sections: [
      { id: "jarvis", name: "Funnel", icon: Filter, unique: true },
      { id: "cta", name: "Call-to-Action", icon: MousePointerClickIcon },
    ],
  },
  SOCIAL_PROOF: {
    title: "Social Proof",
    sections: [
      { id: "testimonials", name: "Kundenstimmen", icon: MessageSquareQuote },
      { id: "partners", name: "Partner Logos", icon: GalleryHorizontalEndIcon },
    ],
  },
};


export const UPLOAD_CONFIG = {
  maxSizeMB: 5,
  maxFiles: 3,
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'ico', 'svg'] as const,
  allowedMimeTypes: [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'image/avif',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/ico',
    'image/svg+xml'
  ] as const,
  bucketName: 'user-images' as const,
  
  get maxSizeBytes() {
    return this.maxSizeMB * 1024 * 1024;
  },
  
  get allowedExtensionsText() {
    return this.allowedExtensions.join(', ').toUpperCase();
  },
} as const;




