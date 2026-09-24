import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ModalCard } from './ModalCard';
import { ServiceItem } from '../../types';
import { fmtMoney } from '../../utils/format';
import { FontAwesome6 } from '@expo/vector-icons'; 

interface Props {
  day: number | null;
  monthTitle: string;
  ym: string;
  services: ServiceItem[];
  onClose: () => void;
  onTogglePaid: (service: ServiceItem) => void;
  onDelete: (service: ServiceItem) => void;
}

export function DayDetailModal({ day, monthTitle, ym, services, onClose, onTogglePaid, onDelete }: Props) {
  const visible = day !== null;
  const dayServices = day !== null ? services.filter((s) => s.billingDay === day) : [];
  const totalDay = dayServices.reduce((sum, s) => sum + s.amount, 0);

  return (
    <ModalCard visible={visible} title={day !== null ? `Día ${day}` : ''} onClose={onClose}>
      <View className="px-6 pt-3 pb-4 border-b border-transparent">
        <Text className="text-white text-sm text-brand-400 font-bold uppercase tracking-widest">{monthTitle}</Text>
      </View>

      <ScrollView className="px-6 pt-4" contentContainerStyle={{ gap: 12, paddingBottom: 16 }} style={{ maxHeight: 380 }}>
        {dayServices.length === 0 ? (
          <View className=" rounded-2xl p-6 items-center">
            <Text className="text-white text-sm font-medium text-center">No hay cobros programados este día.</Text>
          </View>
        ) : (
          dayServices.map((s) => {
            const isPaid = s.paidMonths.includes(ym);
            return (
              <View
                key={s.id}
                className={`rounded-2xl p-4 border transition-colors ${
                  isPaid ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-white/10 bg-slate-900/60'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="font-bold text-lg text-slate-100" numberOfLines={1}>
                      {s.name}
                    </Text>
                    <Text className="text-[12px] text-slate-400 mt-1 uppercase font-bold tracking-wide">
                      {s.category === 'INSTALLMENT' ? 'A plazos' : 'Suscripción'}
                    </Text>
                  </View>
                  <Text className="font-black text-base text-slate-100 tracking-tight">{fmtMoney(s.amount)}</Text>
                </View>
                
                <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-white/5">
                  {isPaid ? (
                    <View className="bg-emerald-500/15 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex-row items-center gap-1.5">
                      <FontAwesome6 name="check-double" size={12} color="#34d399" />
                      <Text className="text-xs font-bold text-emerald-400">Pagado</Text>
                    </View>
                  ) : (
                    <Pressable 
                      onPress={() => onTogglePaid(s)} 
                      className="px-4 py-2 rounded-lg bg-brand-600 border border-brand-500 shadow-sm active:scale-95 flex-row items-center gap-2"
                    >
                      <FontAwesome6 name="check" size={12} color="white" />
                      <Text className="text-xs font-bold text-white">Pagar mes</Text>
                    </Pressable>
                  )}
                  
                  <Pressable 
                    onPress={() => onDelete(s)} 
                    className="p-2.5 bg-slate-950/50 rounded-lg active:scale-95 border border-white/5"
                  >
                    <FontAwesome6 name="trash-can" size={14} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <View className="px-6 py-5 border-t border-white/5 flex-row items-center justify-between bg-slate-900/80">
        <View>
          <Text className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total del día</Text>
          <Text className="text-lg text-slate-100 font-black tracking-tight">{fmtMoney(totalDay)}</Text>
        </View>
        <Pressable onPress={onClose} className="px-6 py-3 rounded-xl bg-slate-800 border border-white/10 active:scale-95">
          <Text className="text-sm font-bold text-slate-200">Cerrar</Text>
        </Pressable>
      </View>
    </ModalCard>
  );
}