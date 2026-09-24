import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { buildThemeVars, ACCENT_SWATCHES } from '../lib/theme';
import { storage } from '../lib/storage';
import { AccentColor, AppSettings, DEFAULT_SETTINGS, ThemeMode } from '../types';

interface ThemeContextValue {
  settings: AppSettings;
  resolvedMode: 'dark' | 'light';
  setThemeMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storage.getSettings().then((s) => {
      setSettings(s);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) storage.saveSettings(settings);
  }, [settings, loaded]);

  const resolvedMode: 'dark' | 'light' =
    settings.themeMode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : settings.themeMode;

  const updateSettings = (partial: Partial<AppSettings>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  const value = useMemo<ThemeContextValue>(
    () => ({
      settings,
      resolvedMode,
      setThemeMode: (mode) => updateSettings({ themeMode: mode }),
      setAccent: (accent) => updateSettings({ accent }),
      updateSettings,
    }),
    [settings, resolvedMode]
  );

  const themeVars = buildThemeVars(resolvedMode, settings.accent);

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVars]} className={resolvedMode === 'dark' ? 'bg-slate-950' : 'bg-slate-950'}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}

export { ACCENT_SWATCHES };
