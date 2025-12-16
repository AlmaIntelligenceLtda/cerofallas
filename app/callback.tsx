import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Callback() {
  const { isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded) {
      router.replace('/(root)/(tabs)/home');
    }
  }, [isLoaded]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#852b96" />
    </View>
  );
}
