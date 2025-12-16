import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, Alert } from 'react-native';

import { images } from '@/constants';

export default function Index() {
  const { isLoaded: authLoaded, isSignedIn: authSigned } = useAuth();
  const { isLoaded: userLoaded, isSignedIn: userSigned, user } = useUser();

  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoaded || !userLoaded) {
      return;
    }

    if (authSigned && userSigned && user) {
      setRedirectTo('/(root)/(tabs)/home');
    } else {
      setRedirectTo('/(auth)/welcome');
    }
  }, [authLoaded, authSigned, userLoaded, userSigned, user && user.id]);

  // Pantalla de carga mientras decidimos a dónde ir
  if (!redirectTo) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Image source={images.icon} className="mb-6 h-28 w-28" />
        <ActivityIndicator size="large" color="#852b96" />
      </View>
    );
  }

  // Redirigir a la ruta correcta
  return <Redirect href={redirectTo} />;
}
