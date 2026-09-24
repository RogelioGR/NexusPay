import React from 'react';
import { View, Text } from 'react-native';
import { fmtMoney } from '../utils/format';

interface Props {
  committed: number;
  paid: number;
  pending: number;
}

export function SummaryCards({ committed, paid, pending }: Props) {
  return (
    <View className="flex-row flex-wrap -mx-1.5">
      <SummaryCard className="w-1/2 sm:w-1/3" label="Comprometido" value={committed} valueClass="text-slate-100" labelClass="text-slate-400" />
      <SummaryCard className="w-1/2 sm:w-1/3" label="Pagado" value={paid} valueClass="text-emerald-400" labelClass="text-emerald-400/80" />
      <SummaryCard className="w-full sm:w-1/3" label="Pendiente" value={pending} valueClass="text-amber-400" labelClass="text-amber-400/80" />
    </View>
  );
}

function SummaryCard({
  className,
  label,
  value,
  valueClass,
  labelClass,
}: {
  className: string;
  label: string;
  value: number;
  valueClass: string;
  labelClass: string;
}) {
  return (
    <View className={`${className} p-1.5`}>
      <View className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
        <Text className={`text-xs font-medium tracking-wide uppercase ${labelClass}`}>{label}</Text>
        <Text className={`text-2xl font-black mt-2 tracking-tight ${valueClass}`}>{fmtMoney(value)}</Text>
      </View>
    </View>
  );
}
