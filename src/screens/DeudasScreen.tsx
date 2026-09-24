import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { DebtCard } from '../components/DebtCard';
import { DebtModal } from '../components/Modals/DebtModal';
import { storage } from '../lib/storage';
import { DebtItem } from '../types';
import { fmtMoney, ymKey } from '../utils/format';

interface Props {
  modalOpen: boolean;
  onModalClose: () => void;
}

export default function DeudasScreen({ modalOpen, onModalClose }: Props) {
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ym = ymKey(new Date());

  useEffect(() => {
    storage.getDebts().then((d) => {
      setDebts(d);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) storage.saveDebts(debts);
  }, [debts, loaded]);

  const totalMonthly = useMemo(() => debts.reduce((sum, d) => sum + d.monthlyAmount, 0), [debts]);

  function addDebt(debt: DebtItem) {
    setDebts((prev) => [...prev, debt]);
  }

  function requestTogglePaid(debt: DebtItem) {
    const willMarkPaid = !debt.paidMonths.includes(ym);
    Alert.alert(
      'Confirmar Pago',
      willMarkPaid
        ? `¿Marcar "${debt.name}" (${debt.otherName}) como pagado este mes?`
        : `¿Quitar el pago de "${debt.name}" para este mes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () =>
            setDebts((prev) =>
              prev.map((d) =>
                d.id === debt.id
                  ? { ...d, paidMonths: willMarkPaid ? [...d.paidMonths, ym] : d.paidMonths.filter((m) => m !== ym) }
                  : d
              )
            ),
        },
      ]
    );
  }

  function requestDelete(debt: DebtItem) {
    Alert.alert('Eliminar Deuda', `¿Eliminar "${debt.name}" de ${debt.otherName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setDebts((prev) => prev.filter((d) => d.id !== debt.id)) },
    ]);
  }

  return (
    <>
      <ScrollView className="flex-1 bg-slate-950" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 20 }}>
        <View>
          <Text className="text-xl font-black text-slate-100 tracking-tight">Deudas y Préstamos</Text>
          <Text className="text-sm text-slate-400 mt-1">Registra lo que prestaste y lleva el control mensual.</Text>
        </View>

        <View className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
          <Text className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total mensual a cobrar</Text>
          <Text className="text-2xl font-black mt-2 text-slate-100">{fmtMoney(totalMonthly)}</Text>
        </View>

        {debts.length === 0 ? (
          <View className="bg-slate-900/60 border border-white/5 rounded-3xl p-8 items-center">
            <Text className="text-slate-500 text-sm text-center">Aún no registras deudas o préstamos.</Text>
          </View>
        ) : (
          <View className="gap-3">
            {debts.map((d) => (
              <DebtCard key={d.id} debt={d} ym={ym} onTogglePaid={() => requestTogglePaid(d)} onDelete={() => requestDelete(d)} />
            ))}
          </View>
        )}
      </ScrollView>

      <DebtModal visible={modalOpen} onClose={onModalClose} onSave={addDebt} />
    </>
  );
}
