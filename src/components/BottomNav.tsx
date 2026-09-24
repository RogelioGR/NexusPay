import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

export type TabKey = 'inicio' | 'deudas' | 'ajustes';

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  onAddPress: () => void;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'inicio', label: 'Inicio', icon: 'house' },
  { key: 'deudas', label: 'Deudas', icon: 'hand-holding-dollar' },
];

const BRAND = '#6366f1'; // Índigo para pestañas activas
const GREEN = '#10b981'; // Esmeralda (emerald-500) para el botón "+"
const BG = '#020617';

export function BottomNav({ active, onChange, onAddPress }: Props) {
  const insets = useSafeAreaInsets();
  const middleIndex = Math.ceil(TABS.length / 2);
  const leftTabs = TABS.slice(0, middleIndex);
  const rightTabs = TABS.slice(middleIndex);

  return (
    <View style={{ backgroundColor: BG, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }}>
      <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'space-around' }}>
        
        {leftTabs.map((tab) => (
          <TabButton key={tab.key} tab={tab} active={active === tab.key} onPress={() => onChange(tab.key)} />
        ))}

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
          <Pressable
            onPress={onAddPress}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: GREEN, 
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -24,
              borderWidth: 4,
              borderColor: BG,
              shadowColor: GREEN, 
              shadowOpacity: 0.5,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 0 },
              elevation: 6,
            }}
          >
            <FontAwesome6 name="plus" size={24} color="white" />
          </Pressable>
        </View>

        {rightTabs.map((tab) => (
          <TabButton key={tab.key} tab={tab} active={active === tab.key} onPress={() => onChange(tab.key)} />
        ))}

      </View>

      <View style={{ height: Math.max(insets.bottom, 8) }} />
    </View>
  );
}

function TabButton({
  tab,
  active,
  onPress,
}: {
  tab: { key: TabKey; label: string; icon: string };
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 2 }}>
      <FontAwesome6 
        name={tab.icon} 
        size={20} 
        color={active ? BRAND : '#64748b'} 
        style={{ opacity: active ? 1 : 0.6 }}
      />
      <Text style={{ fontSize: 10, fontWeight: '700', color: active ? BRAND : '#64748b' }}>{tab.label}</Text>
    </Pressable>
  );
}