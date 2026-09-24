import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, DEFAULT_SETTINGS, DebtItem, ServiceItem } from '../types';

const KEYS = {
  services: 'endyos_services',
  debts: 'endyos_shared',
  settings: 'endyos_settings',
};

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.warn(`No se pudo leer ${key}:`, e);
    return fallback;
  }
}

async function writeJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`No se pudo guardar ${key}:`, e);
  }
}

export const storage = {
  getServices: () => readJSON<ServiceItem[]>(KEYS.services, []),
  saveServices: (services: ServiceItem[]) => writeJSON(KEYS.services, services),

  getDebts: () => readJSON<DebtItem[]>(KEYS.debts, []),
  saveDebts: (debts: DebtItem[]) => writeJSON(KEYS.debts, debts),

  getSettings: () => readJSON<AppSettings>(KEYS.settings, DEFAULT_SETTINGS),
  saveSettings: (settings: AppSettings) => writeJSON(KEYS.settings, settings),

  clearAll: async () => {
    await AsyncStorage.multiRemove([KEYS.services, KEYS.debts, KEYS.settings]);
  },

  exportJSON: async () => {
    const [services, debts, settings] = await Promise.all([
      readJSON<ServiceItem[]>(KEYS.services, []),
      readJSON<DebtItem[]>(KEYS.debts, []),
      readJSON<AppSettings>(KEYS.settings, DEFAULT_SETTINGS),
    ]);
    return JSON.stringify({ services, debts, settings, exportedAt: new Date().toISOString() }, null, 2);
  },
};
