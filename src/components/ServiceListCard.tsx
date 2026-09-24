import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ServiceItem } from '../types';
import { fmtMoney, getRangeMonths } from '../utils/format';

interface Props {
  service: ServiceItem;
  ym: string;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ServiceListCard({ service, ym, onTogglePaid, onDelete }: Props) {
  const isPaid = service.paidMonths.includes(ym);
  const isInstallment = service.category === 'INSTALLMENT';

  let metaLabel = 'Suscripción';
  if (isInstallment) {
    const months = getRangeMonths(service.startMonth, service.endMonth);
    const paidCount = months.filter((m) => service.paidMonths.includes(m)).length;
    metaLabel = `${paidCount}/${months.length} pagados`;
  }

  return (
    <View className={`bg-slate-900/60 rounded-2xl p-4 gap-3 border ${isPaid ? 'border-emerald-500/30' : 'border-white/5'}`}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-row items-start flex-1 gap-3">
          <View
            className={`w-11 h-11 rounded-xl items-center justify-center border ${
              isPaid ? 'bg-emerald-500/15 border-emerald-500/20' : 'bg-slate-800/80 border-white/5'
            }`}
          >
            <Text className={isPaid ? 'text-emerald-400' : 'text-slate-400'}>{isPaid ? '✓' : isInstallment ? '💳' : '🧾'}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-sm text-slate-100" numberOfLines={1}>
              {service.name}
            </Text>
            <Text className="text-xs text-slate-400 mt-1 mb-2">Día {service.billingDay}</Text>
            <Text
              className={`self-start text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${
                isInstallment ? 'text-indigo-300 bg-indigo-500/20 border-indigo-500/20' : 'text-blue-300 bg-blue-500/20 border-blue-500/20'
              }`}
            >
              {metaLabel}
            </Text>
          </View>
        </View>
        <Text className="font-black text-base text-slate-100">{fmtMoney(service.amount)}</Text>
      </View>

      <View className="flex-row items-center justify-between pt-3 mt-1 border-t border-white/5">
        {isPaid ? (
          <View className="flex-row items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <Text className="text-xs font-bold text-emerald-400">✓ Pagado</Text>
          </View>
        ) : (
          <Pressable
            onPress={() => onTogglePaid(service.id)}
            className="px-4 py-2 rounded-lg bg-brand-600/20 border border-brand-500/20"
          >
            <Text className="text-xs font-bold text-brand-400">Pagar mes</Text>
          </Pressable>
        )}
        <Pressable onPress={() => onDelete(service.id)} className="p-2 bg-slate-900/50 rounded-lg">
          <Text className="text-slate-500 text-sm">🗑</Text>
        </Pressable>
      </View>
    </View>
  );
}
