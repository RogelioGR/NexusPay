import React from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Switch, Alert, Share } from 'react-native';
import { useTheme, ACCENT_SWATCHES } from '../context/ThemeContext';
import { storage } from '../lib/storage';
import { ThemeMode } from '../types';

const MODE_LABELS: { key: ThemeMode; label: string }[] = [
  { key: 'dark', label: 'Oscuro' },
  { key: 'light', label: 'Claro' },
  { key: 'system', label: 'Sistema' },
];

export default function AjustesScreen() {
  const { settings, setThemeMode, setAccent, updateSettings } = useTheme();

  async function handleExport() {
    const json = await storage.exportJSON();
    try {
      await Share.share({ message: json, title: 'EndyOS Pay - Copia de seguridad' });
    } catch (e) {
      Alert.alert('No se pudo compartir', 'Intenta de nuevo.');
    }
  }

  function handleClearAll() {
    Alert.alert(
      'Borrar memoria caché',
      'Esto elimina permanentemente todos tus gastos, deudas y ajustes guardados en este dispositivo. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar Datos',
          style: 'destructive',
          onPress: async () => {
            await storage.clearAll();
            Alert.alert('Listo', 'Se borraron todos los datos. Reinicia la app para verlo reflejado.');
          },
        },
      ]
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-950" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 20 }}>
      <Text className="text-xl font-black text-slate-100 tracking-tight">Ajustes</Text>

      {/* Apariencia */}
      <View className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 gap-6">
        <Text className="text-xs font-black text-pink-400 uppercase tracking-widest">Apariencia</Text>

        <View>
          <Text className="font-semibold text-slate-200 text-sm mb-3">Tema de la aplicación</Text>
          <View className="flex-row bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 gap-1.5">
            {MODE_LABELS.map((m) => (
              <Pressable
                key={m.key}
                onPress={() => setThemeMode(m.key)}
                className={`flex-1 py-2.5 rounded-xl items-center ${settings.themeMode === m.key ? 'bg-brand-600' : ''}`}
              >
                <Text className={`text-xs font-bold ${settings.themeMode === m.key ? 'text-white' : 'text-slate-400'}`}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text className="font-semibold text-slate-200 text-sm mb-3">Color de acento</Text>
          <View className="flex-row gap-4 bg-slate-900/30 p-3 rounded-2xl border border-white/5" style={{ alignSelf: 'flex-start' }}>
            {ACCENT_SWATCHES.map((a) => (
              <Pressable
                key={a.key}
                onPress={() => setAccent(a.key)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: a.hex,
                  borderWidth: settings.accent === a.key ? 2 : 0,
                  borderColor: '#fff',
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Notificaciones */}
      <View className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 gap-5">
        <Text className="text-xs font-black text-brand-400 uppercase tracking-widest">Notificaciones</Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="font-semibold text-slate-200 text-sm">Alertas de Vencimiento</Text>
            <Text className="text-[11px] text-slate-400 mt-1">
              Avisos {settings.reminderDays} días antes de cada fecha de cobro.
            </Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
          />
        </View>

        <View className="flex-row items-center justify-between bg-slate-900/30 p-4 rounded-2xl border border-white/5">
          <Text className="text-xs font-medium text-slate-300">Días de anticipación</Text>
          <View className="flex-row items-center gap-2">
            <TextInput
              value={String(settings.reminderDays)}
              onChangeText={(v) => {
                const n = Math.min(14, Math.max(0, parseInt(v.replace(/[^0-9]/g, ''), 10) || 0));
                updateSettings({ reminderDays: n });
              }}
              keyboardType="number-pad"
              className="w-14 bg-slate-950/80 border border-white/10 rounded-xl px-2 py-1.5 text-sm font-bold text-slate-100 text-center"
            />
            <Text className="text-xs text-slate-400 font-medium">días</Text>
          </View>
        </View>
      </View>

      {/* Gestión de datos */}
      <View className="bg-slate-900/60 border border-white/5 rounded-3xl p-6 gap-5">
        <Text className="text-xs font-black text-emerald-400 uppercase tracking-widest">Gestión de Datos</Text>

        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1">
            <Text className="font-semibold text-slate-200 text-sm">Copia de Seguridad</Text>
            <Text className="text-[11px] text-slate-400 mt-1">Comparte tus registros en formato JSON.</Text>
          </View>
          <Pressable onPress={handleExport} className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
            <Text className="text-xs font-bold text-emerald-300">Exportar</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
          <View className="flex-1">
            <Text className="font-semibold text-red-400 text-sm">Borrar memoria caché</Text>
            <Text className="text-[11px] text-slate-400 mt-1">Elimina permanentemente los datos locales.</Text>
          </View>
          <Pressable onPress={handleClearAll} className="bg-red-500/10 border border-red-500/30 px-4 py-2.5 rounded-xl">
            <Text className="text-xs font-bold text-red-400">Borrar Datos</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
