import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { ModalCard } from './ModalCard';
import { MonthPicker } from './MonthPicker';
import { DebtCategory, DebtItem } from '../../types';
import { fmtMoney, getRangeMonths, ymKey } from '../../utils/format';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (debt: DebtItem) => void;
}

export function DebtModal({ visible, onClose, onSave }: Props) {
  const [category, setCategory] = useState<DebtCategory>('RECURRING');
  const [name, setName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [day, setDay] = useState('');
  const [subStartMonth, setSubStartMonth] = useState(ymKey(new Date()));
  const [startMonth, setStartMonth] = useState(ymKey(new Date()));
  const [installmentsCount, setInstallmentsCount] = useState('6');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) {
      setCategory('RECURRING');
      setName('');
      setOtherName('');
      setMonthlyAmount('');
      setDay('');
      setSubStartMonth(ymKey(new Date()));
      setStartMonth(ymKey(new Date()));
      setInstallmentsCount('6');
    }
  }, [visible]);

  const endMonth = calcEndMonth(startMonth, installmentsCount);
  const monthly = parseFloat(monthlyAmount) || 0;
  const months = parseInt(installmentsCount, 10) || 0;
  const totalCost = monthly * months;

  const isValid = name.trim().length > 0 && otherName.trim().length > 0 && monthly > 0 && Number(day) >= 1 && Number(day) <= 31;

  function handleSubmit() {
    if (!isValid) return;
    const debt: DebtItem = {
      id: Date.now().toString(),
      name: name.trim(),
      otherName: otherName.trim(),
      monthlyAmount: monthly,
      totalAmount: category === 'INSTALLMENT' ? totalCost : undefined,
      billingDay: Number(day),
      category,
      paidMonths: [],
      startMonth: category === 'INSTALLMENT' ? startMonth : subStartMonth,
      endMonth: category === 'INSTALLMENT' ? endMonth : undefined,
    };
    onSave(debt);
    onClose();
  }

  return (
    <ModalCard visible={visible} title="Nueva Deuda / Préstamo" onClose={onClose}>
      <ScrollView className="p-6 md:p-8" contentContainerStyle={{ gap: 24 }}>
        <View>
          <Text className="text-sm font-bold tracking-wider text-slate-400 mb-3 uppercase">Tipo de deuda</Text>
          <View className="flex-row bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 gap-2">
            <ToggleButton label="Gasto Recurrente" active={category === 'RECURRING'} onPress={() => setCategory('RECURRING')} />
            <ToggleButton label="Deuda a Plazos" active={category === 'INSTALLMENT'} onPress={() => setCategory('INSTALLMENT')} />
          </View>
        </View>

        <View className="flex-row gap-5">
          <View className="flex-1">
            <Text className="text-sm font-bold tracking-wider text-slate-400 mb-3 uppercase">Concepto</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ej. Televisión..."
              placeholderTextColor="#64748b"
              className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-base font-medium text-slate-100"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold tracking-wider text-slate-400 mb-3 uppercase">¿Quién debe?</Text>
            <TextInput
              value={otherName}
              onChangeText={setOtherName}
              placeholder="Ej. Carlos..."
              placeholderTextColor="#64748b"
              className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-base font-medium text-slate-100"
            />
          </View>
        </View>

        <View className="flex-row gap-5 border-t border-white/5 pt-6">
          <View className="flex-1">
            <Text className="text-sm font-bold tracking-wider text-slate-400 mb-3 uppercase">Cuota mensual</Text>
            <TextInput
              value={monthlyAmount}
              onChangeText={setMonthlyAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#64748b"
              className="bg-slate-950/50 border border-brand-500/50 rounded-xl px-4 py-4 text-base font-bold text-slate-100"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold tracking-wider text-slate-400 mb-3 uppercase">Día cobro</Text>
            <TextInput
              value={day}
              onChangeText={(v) => setDay(v.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder="15"
              keyboardType="number-pad"
              placeholderTextColor="#64748b"
              className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-base font-bold text-slate-100 text-center"
            />
          </View>
        </View>

        {category === 'INSTALLMENT' ? (
          <View style={{ gap: 24 }} className="border-t border-white/5 pt-6">
            <View className="flex-row gap-5">
              <View className="flex-1">
                <MonthPicker label="Mes de inicio" value={startMonth} onChange={setStartMonth} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold tracking-wider text-white mb-3 uppercase">Meses</Text>
                <TextInput
                  value={installmentsCount}
                  onChangeText={(v) => setInstallmentsCount(v.replace(/[^0-9]/g, '').slice(0, 3))}
                  keyboardType="number-pad"
                  placeholderTextColor="#64748b"
                  className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-base font-bold text-slate-100 text-center"
                />
              </View>
            </View>
            <MonthPicker label="Fin (Calculado)" value={endMonth} onChange={() => {}} disabled />
            <View className="bg-brand-900/20 border border-brand-500/20 rounded-2xl p-4 flex-row items-center justify-between">
              <Text className="text-sm text-brand-200 font-medium">Costo total:</Text>
              <Text className="text-lg font-black text-brand-400">{fmtMoney(totalCost)}</Text>
            </View>
          </View>
        ) : (
          <View className="text-white pt-6 pb-2">
            <MonthPicker label="Mes de alta" value={subStartMonth} onChange={setSubStartMonth} />
          </View>
        )}
      </ScrollView>

      <View 
        className="px-6 pt-6 border-t border-white/5 flex-row justify-end gap-4 bg-slate-900/50"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <Pressable onPress={onClose} className="px-6 py-3.5 rounded-xl border border-transparent hover:bg-slate-800">
          <Text className="text-base font-bold text-slate-400">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid}
          className={`px-8 py-3.5 rounded-xl ${isValid ? 'bg-brand-600 active:scale-95 shadow-md shadow-brand-500/30' : 'bg-slate-800 border border-white/5'}`}
        >
          <Text className={`text-base font-bold ${isValid ? 'text-white' : 'text-slate-500'}`}>Guardar Deuda</Text>
        </Pressable>
      </View>
    </ModalCard>
  );
}

function ToggleButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`flex-1 py-3 rounded-xl items-center justify-center ${active ? 'bg-brand-600 shadow-sm' : ''}`}>
      <Text className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-400'}`}>{label}</Text>
    </Pressable>
  );
}

function calcEndMonth(start: string, countStr: string): string {
  const count = parseInt(countStr, 10) || 0;
  if (!start || count <= 0) return '';
  const months = getRangeMonths(start, addMonths(start, count - 1));
  return months[months.length - 1] || '';
}

function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number);
  const total = y * 12 + (m - 1) + n;
  const newY = Math.floor(total / 12);
  const newM = (total % 12) + 1;
  return `${newY}-${String(newM).padStart(2, '0')}`;
}