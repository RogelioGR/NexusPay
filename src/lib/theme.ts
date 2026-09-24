import { vars } from 'nativewind';
import { AccentColor, ThemeMode } from '../types';


const SLATE_DARK = {
  50: '248 250 252', 100: '241 245 249', 200: '226 232 240', 300: '203 213 225',
  400: '148 163 184', 500: '100 116 139', 600: '71 85 105', 700: '51 65 85',
  800: '30 41 59', 900: '15 23 42', 950: '2 6 23',
};

const SLATE_LIGHT = {
  50: '2 6 23', 100: '15 23 42', 200: '30 41 59', 300: '51 65 85',
  400: '71 85 105', 500: '100 116 139', 600: '148 163 184', 700: '203 213 225',
  800: '226 232 240', 900: '255 255 255', 950: '240 244 248',
};

const ACCENTS: Record<AccentColor, Record<string, string>> = {
  indigo: { 50: '238 242 255', 100: '224 231 255', 300: '165 180 252', 400: '129 140 248', 500: '99 102 241', 600: '79 70 229', 700: '67 56 202', 900: '49 46 129' },
  emerald: { 50: '236 253 245', 100: '209 250 229', 300: '110 231 183', 400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87', 900: '6 78 59' },
  rose: { 50: '255 241 242', 100: '255 228 230', 300: '253 164 175', 400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60', 900: '136 19 55' },
  amber: { 50: '255 251 235', 100: '254 243 199', 300: '252 211 77', 400: '251 191 36', 500: '245 158 11', 600: '217 119 6', 700: '180 83 9', 900: '120 53 15' },
  sky: { 50: '240 249 255', 100: '224 242 254', 300: '125 211 252', 400: '56 189 248', 500: '14 165 233', 600: '2 132 199', 700: '3 105 161', 900: '12 74 110' },
};


export function buildThemeVars(mode: Exclude<ThemeMode, 'system'>, accent: AccentColor) {
  const slate = mode === 'light' ? SLATE_LIGHT : SLATE_DARK;
  const brand = ACCENTS[accent];

  const cssVars: Record<string, string> = {};
  Object.entries(slate).forEach(([k, v]) => (cssVars[`--slate-${k}`] = v));
  Object.entries(brand).forEach(([k, v]) => (cssVars[`--brand-${k}`] = v));

  return vars(cssVars);
}

export const ACCENT_SWATCHES: { key: AccentColor; hex: string }[] = [
  { key: 'indigo', hex: '#6366f1' },
  { key: 'emerald', hex: '#10b981' },
  { key: 'rose', hex: '#f43f5e' },
  { key: 'amber', hex: '#f59e0b' },
  { key: 'sky', hex: '#0ea5e9' },
];
