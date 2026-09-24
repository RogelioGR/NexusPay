import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onMenuPress: () => void;
  onAddPress: () => void;
}

export function Header({ onMenuPress, onAddPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="bg-slate-950/95 border-b border-white/5">
      <View className="flex-row items-center justify-between px-4 h-14">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={onMenuPress} hitSlop={8}>
          </Pressable>
          <Text className="font-bold text-2xl text-slate-100">NexusPay</Text>
        </View>
     
      </View>
    </View>
  );
}
