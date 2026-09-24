import React from 'react';
import { Modal as RNModal, View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  titleColorClass?: string; 
}

export function ModalCard({ visible, title, onClose, children, titleColorClass = 'text-slate-100' }: Props) {
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-slate-950/80 items-center justify-center p-4"
      >
        <View className="bg-slate-900 rounded-3xl w-full max-w-md border border-white/10 overflow-hidden" style={{ maxHeight: '85%' }}>
          <View className="px-6 py-5 border-b border-white/5 flex-row items-center justify-between bg-slate-900/50">
            <Text className={`font-bold text-lg tracking-tight ${titleColorClass}`}>{title}</Text>
            <Pressable onPress={onClose} className="bg-slate-800/50 w-8 h-8 rounded-full items-center justify-center">
              <Text className="text-slate-400">✕</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
