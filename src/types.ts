export type Category = 'SUBSCRIPTION' | 'INSTALLMENT';

export interface ServiceItem {
  id: string;
  name: string;
  amount: number;
  billingDay: number; // 1-31
  category: Category;
  paidMonths: string[]; // ['2026-09', ...]
  startMonth?: string; // solo INSTALLMENT, 'YYYY-MM'
  endMonth?: string; // solo INSTALLMENT
  isShared?: boolean;
}

export type DebtCategory = 'RECURRING' | 'INSTALLMENT';

export interface DebtItem {
  id: string;
  name: string; // Concepto
  otherName: string; // ¿Quién debe?
  monthlyAmount: number;
  totalAmount?: number; // costo total del artículo, solo INSTALLMENT
  billingDay: number;
  category: DebtCategory;
  paidMonths: string[];
  startMonth?: string;
  endMonth?: string; 
}

export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppSettings {
  themeMode: ThemeMode;
  accent: AccentColor;
  reminderDays: number;
  density: 'comfortable' | 'compact';
  notificationsEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  accent: 'indigo',
  reminderDays: 2,
  density: 'comfortable',
  notificationsEnabled: false,
};
