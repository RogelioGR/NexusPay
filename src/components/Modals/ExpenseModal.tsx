import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { ModalCard } from './ModalCard';
import { MonthPicker } from './MonthPicker';
import { Category, ServiceItem } from '../../types';
import { fmtMoney, getRangeMonths, ymKey } from '../../utils/format';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (service: ServiceItem) => void;
}

export function ExpenseModal({ visible, onClose, onSave }: Props) {
  const [category, setCategory] = useState<Category>('SUBSCRIPTION');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('');
  const [subStartMonth, setSubStartMonth] = useState(ymKey(new Date()));
  const [startMonth, setStartMonth] = useState(ymKey(new Date()));
  const [installmentsCount, setInstallmentsCount] = useState('6');

  useEffect(() => {
    if (visible) {
      setCategory('SUBSCRIPTION');
      setName('');
      setAmount('');
      setDay('');
      setSubStartMonth(ymKey(new Date()));
      setStartMonth(ymKey(new Date()));
      setInstallmentsCount('6');
    }
  }, [visible]);

  const endMonth = calcEndMonth(startMonth, installmentsCount);
  const monthlyAmount = parseFloat(amount) || 0;
  const monthsCount = parseInt(installmentsCount, 10) || 0;
  const totalEstimated = monthlyAmount * monthsCount;

  const isValid = name.trim().length > 0 && monthlyAmount > 0 && Number(day) >= 1 && Number(day) <= 31;

  function handleSubmit() {
    if (!isValid) return;
    const service: ServiceItem = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: monthlyAmount,
      billingDay: Number(day),
      category,
      paidMonths: [],
      startMonth: category === 'INSTALLMENT' ? startMonth : subStartMonth,
      endMonth: category === 'INSTALLMENT' ? endMonth : undefined,
    };
    onSave(service);
    onClose();
  }

  return (
    <ModalCard visible={visible} title="Nuevo Gasto / Suscripción" onClose={onClose}>
      <ScrollView className="p-6" contentContainerStyle={{ gap: 20 }}>
        {/* Categoría */}
        <View>
          <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2 uppercase">Categoría</Text>
          <View className="flex-row bg-slate-950/60 p-1.5 rounded-xl border border-white/5 gap-2">
            <ToggleButton label="Fijo / Suscripción" active={category === 'SUBSCRIPTION'} onPress={() => setCategory('SUBSCRIPTION')} />
            <ToggleButton label="A Plazos" active={category === 'INSTALLMENT'} onPress={() => setCategory('INSTALLMENT')} />
          </View>
        </View>

        {/* Nombre */}
        <View>
          <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2 uppercase">Nombre del servicio</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ej. Amazon Prime..."
            placeholderTextColor="#64748b"
            className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-100"
          />
        </View>

        {/* Monto + día */}
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2 uppercase">
              {category === 'INSTALLMENT' ? 'Monto mensual' : 'Monto mensual'}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#64748b"
              className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-100"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2 uppercase">Día de cobro</Text>
            <TextInput
              value={day}
              onChangeText={(v) => setDay(v.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder="18"
              keyboardType="number-pad"
              placeholderTextColor="#64748b"
              className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-100"
            />
          </View>
        </View>

        {category === 'INSTALLMENT' ? (
          <View style={{ gap: 20 }}>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <MonthPicker label="Mes de inicio" value={startMonth} onChange={setStartMonth} />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold tracking-wide text-slate-400 mb-2 uppercase">Meses</Text>
                <TextInput
                  value={installmentsCount}
                  onChangeText={(v) => setInstallmentsCount(v.replace(/[^0-9]/g, '').slice(0, 3))}
                  keyboardType="number-pad"
                  placeholderTextColor="#64748b"
                  className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-100"
                />
              </View>
            </View>
            <MonthPicker label="Fin (Auto)" value={endMonth} onChange={() => {}} disabled />
            <View className="bg-brand-900/20 border border-brand-500/20 rounded-xl p-3.5 flex-row items-center justify-between">
              <Text className="text-xs text-brand-200 font-medium">Total estimado:</Text>
              <Text className="text-sm font-black text-brand-400">
                {fmtMoney(monthlyAmount)} / mes (Total: {fmtMoney(totalEstimated)})
              </Text>
            </View>
          </View>
        ) : (
          <MonthPicker label="Mes de alta" value={subStartMonth} onChange={setSubStartMonth} />
        )}
      </ScrollView>

      <View className="px-6 py-5 border-t border-white/5 flex-row justify-end gap-3 bg-slate-900/30">
        <Pressable onPress={onClose} className="px-5 py-2.5 rounded-xl">
          <Text className="text-sm font-bold text-slate-400">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={!isValid}
          className={`px-6 py-2.5 rounded-xl ${isValid ? 'bg-brand-600' : 'bg-slate-700/50'}`}
        >
          <Text className="text-sm font-bold text-white">Guardar Gasto</Text>
        </Pressable>
      </View>
    </ModalCard>
  );
}

function ToggleButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`flex-1 py-2.5 rounded-lg items-center ${active ? 'bg-brand-600' : ''}`}>
      <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-slate-400'}`}>{label}</Text>
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
  const total = (y * 12 + (m - 1)) + n;
  const newY = Math.floor(total / 12);
  const newM = (total % 12) + 1;
  return `${newY}-${String(newM).padStart(2, '0')}`;
}
