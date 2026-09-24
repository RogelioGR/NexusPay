import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ServiceItem } from '../types';
import { daysInMonth, isSameMonth, ymKey } from '../utils/format';

interface Props {
  viewDate: Date;
  services: ServiceItem[];
  onDayPress: (day: number) => void;
  onGoToToday?: () => void;
}

const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

export function CalendarGrid({ viewDate, services, onDayPress, onGoToToday }: Props) {
  const ym = ymKey(viewDate);
  const total = daysInMonth(viewDate);
  const today = new Date();
  const viewingToday = isSameMonth(viewDate, today);

  const jsFirstWeekday = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const firstWeekday = (jsFirstWeekday + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  return (
    <View>
      {!viewingToday && (
        <Pressable onPress={onGoToToday} className="self-center bg-brand-600/20 border border-brand-500/30 px-3 py-1 rounded-full mb-4">
          <Text className="text-[11px] font-bold text-brand-300">Ir a hoy</Text>
        </Pressable>
      )}

      <View className="flex-row mb-2">
        {WEEKDAYS.map((w) => (
          <Text key={w} className="flex-1 text-center text-[10px] font-bold text-slate-500">
            {w}
          </Text>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {cells.map((day, idx) => {
          if (day === null) return <View key={idx} style={{ width: '14.28%', height: 44 }} className="p-0.5" />;

          const dayServices = services.filter((s) => s.billingDay === day);
          const totalItems = dayServices.length;
          const isToday = viewingToday && day === today.getDate();

          let bg = 'bg-slate-900/40';
          let border = 'border-white/5';
          let textColor = 'text-slate-300';
          if (totalItems > 0) {
            const allPaid = dayServices.every((s) => s.paidMonths.includes(ym));
            bg = allPaid ? 'bg-emerald-500/20' : 'bg-amber-500/20';
            border = allPaid ? 'border-emerald-500/40' : 'border-amber-500/50';
            textColor = allPaid ? 'text-emerald-300' : 'text-amber-300';
          }
          if (isToday) {
            border = 'border-brand-500';
            textColor = 'text-brand-300';
          }

          return (
            <View key={idx} style={{ width: '14.28%', height: 44 }} className="p-0.5">
              <Pressable
                onPress={() => onDayPress(day)}
                className={`flex-1 rounded-lg border ${border} ${bg} items-center justify-center`}
              >
                <Text className={`text-xs font-bold ${textColor}`}>{day}</Text>
                {totalItems > 0 && <View className="w-1 h-1 rounded-full bg-current mt-0.5" />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}