import React from 'react';
import { View, Text } from 'react-native';

export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View className="flex-1 bg-slate-950 items-center justify-center p-8">
      <Text className="text-slate-500 text-sm text-center">
        {title} — pendiente de construir en la siguiente pasada.
      </Text>
    </View>
  );
}
