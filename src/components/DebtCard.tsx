import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { DebtItem } from '../types';
import { fmtMoney } from '../utils/format';

interface Props {
  debt: DebtItem;
  ym: string;
  onTogglePaid: () => void;
  onDelete: () => void;
}

export function DebtCard({ debt, ym, onTogglePaid, onDelete }: Props) {
  const isPaid = debt.paidMonths.includes(ym);
  const isInstallment = debt.category === 'INSTALLMENT';

  const remaining = isInstallment && debt.totalAmount
    ? Math.max(0, debt.totalAmount - debt.monthlyAmount * debt.paidMonths.length)
    : null;

  return (
    <View className={`bg-slate-900/60 rounded-2xl p-4 gap-3 border ${isPaid ? 'border-emerald-500/30' : 'border-white/5'}`}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-bold text-sm text-slate-100" numberOfLines={1}>
            {debt.name}
          </Text>
          <Text className="text-xs text-brand-300 mt-0.5 font-medium">{debt.otherName}</Text>
          <Text className="text-xs text-slate-400 mt-1">Día {debt.billingDay}</Text>
        </View>
        <View className="items-end">
          <Text className="font-black text-base text-slate-100">{fmtMoney(debt.monthlyAmount)}</Text>
          {remaining !== null && <Text className="text-[10px] text-slate-500 mt-1">Saldo: {fmtMoney(remaining)}</Text>}
        </View>
      </View>

      <View className="flex-row items-center justify-between pt-3 mt-1 border-t border-white/5">
        <Text
          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md border ${
            isInstallment ? 'text-indigo-300 bg-indigo-500/20 border-indigo-500/20' : 'text-blue-300 bg-blue-500/20 border-blue-500/20'
          }`}
        >
          {isInstallment ? 'A plazos' : 'Recurrente'}
        </Text>

        <View className="flex-row items-center gap-2">
          {isPaid ? (
            <View className="bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Text className="text-xs font-bold text-emerald-400">✓ Pagado</Text>
            </View>
          ) : (
            <Pressable onPress={onTogglePaid} className="px-4 py-2 rounded-lg bg-brand-600/20 border border-brand-500/20">
              <Text className="text-xs font-bold text-brand-400">Marcar pagado</Text>
            </Pressable>
          )}
          <Pressable onPress={onDelete} className="p-2 bg-slate-900/50 rounded-lg">
            <Text className="text-slate-500 text-sm">🗑</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
