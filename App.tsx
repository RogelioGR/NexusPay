import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';
import { ThemeProvider } from './src/context/ThemeContext';
import { Header } from './src/components/Header';
import { BottomNav, TabKey } from './src/components/BottomNav';
import HomeScreen from './src/screens/HomeScreen';
import DeudasScreen from './src/screens/DeudasScreen';
import AjustesScreen from './src/screens/AjustesScreen';

export default function App() {
  const [tab, setTab] = useState<TabKey>('inicio');
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [debtModalOpen, setDebtModalOpen] = useState(false);

  function handleMenuPress() {
    // TODO: menú lateral (drawer), si lo quieres lo agregamos aparte
  }

  
  function handleAddPress() {
    if (tab === 'inicio') setExpenseModalOpen(true);
    if (tab === 'deudas') setDebtModalOpen(true);
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <View className="flex-1 bg-slate-950">
          <Header onMenuPress={handleMenuPress} onAddPress={handleAddPress} />

          {tab === 'inicio' && (
            <HomeScreen modalOpen={expenseModalOpen} onModalClose={() => setExpenseModalOpen(false)} />
          )}
          {tab === 'deudas' && (
            <DeudasScreen modalOpen={debtModalOpen} onModalClose={() => setDebtModalOpen(false)} />
          )}
          {tab === 'ajustes' && <AjustesScreen />}

          <BottomNav active={tab} onChange={setTab} onAddPress={handleAddPress} />
        </View>
      </ThemeProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
