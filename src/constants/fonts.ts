// Font definitions for the application

import type { FontOption } from '../types/app';

export const FONT_OPTIONS: FontOption[] = [
  { value: "Inter, Arial, sans-serif", label: "Inter (mặc định)" },
  { value: "'Times New Roman', Times, serif", label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Comic Sans MS', 'Comic Sans', cursive", label: "Comic Sans" },
  { value: "'Courier New', Courier, monospace", label: "Courier New" },
  { value: "'Dancing Script', cursive", label: "Dancing Script (Google)", isGoogleFont: true },
  { value: "'Pacifico', cursive", label: "Pacifico (Google)", isGoogleFont: true },
  { value: "'Great Vibes', cursive", label: "Great Vibes (Google)", isGoogleFont: true },
  { value: "'Lobster', cursive", label: "Lobster (Google)", isGoogleFont: true },
  { value: "'Playfair Display', serif", label: "Playfair Display (Google)", isGoogleFont: true },
] as const;

export const GOOGLE_FONTS_MAP: Record<string, string> = {
  "'Dancing Script', cursive": 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&display=swap',
  "'Pacifico', cursive": 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
  "'Great Vibes', cursive": 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
  "'Lobster', cursive": 'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
  "'Playfair Display', serif": 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
} as const;

export function getGoogleFontUrl(fontFamily: string): string | null {
  return GOOGLE_FONTS_MAP[fontFamily] || null;
}

export function isGoogleFont(fontFamily: string): boolean {
  return fontFamily in GOOGLE_FONTS_MAP;
}
