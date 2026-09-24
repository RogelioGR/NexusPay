import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Props {
  label: string;
  value: string; 
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MonthPicker({ label, value, onChange, disabled }: Props) {
  const [year, month] = value ? value.split('-') : ['', ''];

  function update(nextYear: string, nextMonth: string) {
    const y = nextYear.replace(/[^0-9]/g, '').slice(0, 4);
    const m = nextMonth.replace(/[^0-9]/g, '').slice(0, 2);
    if (y.length === 4 && m.length > 0) {
      const mm = Math.min(12, Math.max(1, parseInt(m, 10)));
      onChange(`${y}-${String(mm).padStart(2, '0')}`);
    } else {
      onChange('');
    }
  }

  return (
    <View>
      <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2 uppercase">{label}</Text>
      <View className="flex-row gap-2">
        <TextInput
          editable={!disabled}
          value={month}
          onChangeText={(m) => update(year, m)}
          placeholder="MM"
          keyboardType="number-pad"
          maxLength={2}
          placeholderTextColor="#64748b"
          className={`flex-1 rounded-xl px-3 py-3 text-sm font-bold text-slate-100 border ${
            disabled ? 'bg-slate-900/30 border-white/5 text-slate-500' : 'bg-slate-950/50 border-white/10'
          }`}
        />
        <TextInput
          editable={!disabled}
          value={year}
          onChangeText={(y) => update(y, month)}
          placeholder="AAAA"
          keyboardType="number-pad"
          maxLength={4}
          placeholderTextColor="#64748b"
          className={`flex-[1.3] rounded-xl px-3 py-3 text-sm font-bold text-slate-100 border ${
            disabled ? 'bg-slate-900/30 border-white/5 text-slate-500' : 'bg-slate-950/50 border-white/10'
          }`}
        />
      </View>
    </View>
  );
}
