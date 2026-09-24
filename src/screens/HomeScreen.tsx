import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SummaryCards } from '../components/SummaryCards';
import { CalendarGrid } from '../components/CalendarGrid';
import { ServiceListCard } from '../components/ServiceListCard';
import { ExpenseModal } from '../components/Modals/ExpenseModal';
import { DayDetailModal } from '../components/Modals/DayDetailModal';
import { storage } from '../lib/storage';
import { ServiceItem } from '../types';
import { fmtMoney, monthTitle, ymKey } from '../utils/format';

type ListFilter = 'all' | 'pending' | 'paid';

interface Props {
  modalOpen: boolean;
  onModalClose: () => void;
}

export default function HomeScreen({ modalOpen, onModalClose }: Props) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [filter, setFilter] = useState<ListFilter>('all');
  const [loaded, setLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    storage.getServices().then((s) => {
      setServices(s);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) storage.saveServices(services);
  }, [services, loaded]);

  const ym = ymKey(viewDate);

  const { committed, paid, pending } = useMemo(() => {
    const committed = services.reduce((sum, s) => sum + s.amount, 0);
    const paid = services.filter((s) => s.paidMonths.includes(ym)).reduce((sum, s) => sum + s.amount, 0);
    return { committed, paid, pending: committed - paid };
  }, [services, ym]);

  const filteredList = useMemo(() => {
    let list = services.filter((s) => {
      if (filter === 'pending') return !s.paidMonths.includes(ym);
      if (filter === 'paid') return s.paidMonths.includes(ym);
      return true;
    });
    return list.slice().sort((a, b) => a.billingDay - b.billingDay);
  }, [services, filter, ym]);

  function addService(service: ServiceItem) {
    setServices((prev) => [...prev, service]);
  }

  function requestTogglePaid(service: ServiceItem) {
    const willMarkPaid = !service.paidMonths.includes(ym);
    Alert.alert(
      'Confirmar Pago',
      willMarkPaid
        ? `¿Marcar "${service.name}" (${fmtMoney(service.amount)}) como pagado este mes?`
        : `¿Quitar el pago de "${service.name}" para este mes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setServices((prev) =>
              prev.map((s) =>
                s.id === service.id
                  ? {
                      ...s,
                      paidMonths: willMarkPaid ? [...s.paidMonths, ym] : s.paidMonths.filter((m) => m !== ym),
                    }
                  : s
              )
            );
          },
        },
      ]
    );
  }

  function requestDelete(service: ServiceItem) {
    Alert.alert('Eliminar Servicio', `¿Eliminar "${service.name}"? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setServices((prev) => prev.filter((s) => s.id !== service.id)),
      },
    ]);
  }

  function changeMonth(delta: number) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  function goToToday() {
    setViewDate(new Date());
  }

  return (
    <>
      <ScrollView className="flex-1 bg-slate-950" contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 24 }}>
        <SummaryCards committed={committed} paid={paid} pending={pending} />

        <View className="bg-slate-900/60 border border-white/5 rounded-3xl p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Pressable onPress={() => changeMonth(-1)} className="w-10 h-10 rounded-full bg-slate-800/50 items-center justify-center">
              <Text className="text-slate-300">‹</Text>
            </Pressable>
            <Text className="text-lg font-bold text-slate-100">{monthTitle(viewDate)}</Text>
            <Pressable onPress={() => changeMonth(1)} className="w-10 h-10 rounded-full bg-slate-800/50 items-center justify-center">
              <Text className="text-slate-300">›</Text>
            </Pressable>
          </View>
          <CalendarGrid
            viewDate={viewDate}
            services={services}
            onDayPress={(day) => setSelectedDay(day)}
            onGoToToday={goToToday}
          />
        </View>

        <View className="gap-3">
          <View className="flex-row gap-2">
            {(['all', 'pending', 'paid'] as ListFilter[]).map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl border ${
                  filter === f ? 'bg-brand-600 border-brand-500' : 'bg-slate-900/50 border-white/5'
                }`}
              >
                <Text className={`text-xs font-bold ${filter === f ? 'text-white' : 'text-slate-400'}`}>
                  {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : 'Pagados'}
                </Text>
              </Pressable>
            ))}
          </View>

          {filteredList.length === 0 ? (
            <View className="bg-slate-900/60 border border-white/5 rounded-3xl p-8 items-center">
              <Text className="text-slate-500 text-sm">
                {services.length === 0 ? 'Sin gastos registrados para este mes.' : 'No hay gastos en este filtro.'}
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredList.map((s) => (
                <ServiceListCard
                  key={s.id}
                  service={s}
                  ym={ym}
                  onTogglePaid={() => requestTogglePaid(s)}
                  onDelete={() => requestDelete(s)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <ExpenseModal visible={modalOpen} onClose={onModalClose} onSave={addService} />

      <DayDetailModal
        day={selectedDay}
        monthTitle={monthTitle(viewDate)}
        ym={ym}
        services={services}
        onClose={() => setSelectedDay(null)}
        onTogglePaid={requestTogglePaid}
        onDelete={requestDelete}
      />
    </>
  );
}
