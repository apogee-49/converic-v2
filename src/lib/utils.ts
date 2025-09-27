import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import baseline from './baseline.json'
import { sectionCategories, UPLOAD_CONFIG } from './config'
import { createTV } from "tailwind-variants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export type { VariantProps, ClassValue } from 'tailwind-variants';

export const tv = createTV({
  twMerge: cn as any,
});


export const formatCamelCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};


export const getSectionName = (sectionId: string): string => {
  const baseId = sectionId.split('-')[0] ?? '';
  for (const category of Object.values(sectionCategories)) {
    const section = category.sections.find((s) => s.id === baseId);
    if (section) return section.name;
  }
  return baseId.charAt(0).toUpperCase() + baseId.slice(1);
};


export const sectionUtils = {
  canAddSection: (sectionId: string, isUnique: boolean, existingSections: Array<{ type: string }>): boolean => {
    if (!isUnique) return true;
    return !existingSections.some((section) => section.type.split('-')[0] === sectionId);
  },

  getNextSectionId: (sectionId: string, existingSections: Array<{ type: string }>): string => {
    const existingNumbers = existingSections
      .filter((section) => section.type.startsWith(sectionId))
      .map((section) => {
        const match = section.type.match(new RegExp(`${sectionId}(?:-([0-9]+))?`));
        return match?.[1] ? parseInt(match[1]) : 0;
      });
    if (existingNumbers.length === 0) return sectionId;
    const nextNumber = Math.max(...existingNumbers) + 1;
    return `${sectionId}-${nextNumber}`;
  },

  getSectionDisplayName: (sectionId: string, baseTitle: string): string => {
    const parts = sectionId.split('-');
    if (parts.length === 1) return baseTitle;
    const number = parts[1];
    return `${baseTitle} ${number}`;
  },
} as const;


export function sortObjectByBaseline(obj: Record<string, any>, sectionType: string): Record<string, any> {
  const baseId = sectionType.split('-')[0] ?? '';
  const sectionData = (baseline as Record<string, any>)[baseId];
  if (!baseId || typeof sectionData !== 'object' || sectionData === null) return obj;

  const baselineOrder = Object.keys(sectionData);
  const sortedObj: Record<string, any> = {};

  baselineOrder.forEach((key) => {
    if (key in obj) sortedObj[key] = obj[key];
  });

  const remainingKeys = Object.keys(obj)
    .filter((key) => !baselineOrder.includes(key))
    .sort();
  remainingKeys.forEach((key) => {
    sortedObj[key] = obj[key];
  });
  return sortedObj;
}


export function filterPagesByQuery<T extends { title?: string; slug?: string }>(
  pages: Array<T>,
  query: string,
): Array<T> {
  const q = (query || '').trim().toLowerCase();
  if (!q) return pages;
  return pages.filter((p) => {
    const title = (p.title ?? '').toLowerCase();
    const slug = (p.slug ?? '').toLowerCase();
    return title.includes(q) || slug.includes(q);
  });
}


export const formatBytes = (bytes: number, decimals = 2): string => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
};


export const uploadHelpers = {
  validateFile: (file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    return !!(
      fileExtension &&
      (UPLOAD_CONFIG.allowedExtensions as readonly string[]).includes(fileExtension) &&
      (UPLOAD_CONFIG.allowedMimeTypes as readonly string[]).includes(file.type)
    );
  },
  
  generateUniqueFileName: (fileName: string): string => {
    const timestamp = Date.now();
    return `${timestamp}_${fileName}`;
  },
} as const;