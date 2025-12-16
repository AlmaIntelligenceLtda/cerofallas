import { useSSO, useSignIn } from '@clerk/clerk-expo';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';
import { Image, Text, View, Alert } from 'react-native';

import CustomButton from '@/components/CustomButton';
import { icons } from '@/constants';

const OAuth = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'cerofallas',
    path: 'callback',
  });

  const { startSSOFlow } = useSSO();
  const { setActive } = useSignIn(); // 👈 Necesario para activar la sesión

  const handleGoogleSignIn = async () => {
    try {
      const result = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: redirectUri,
      });

      if (result?.createdSessionId) {
        // 👈 Activar sesión en Clerk
        await setActive({ session: result.createdSessionId });
        router.replace('/'); // Va a index.tsx y ahí te manda a home
      } else {
        Alert.alert('❌ No se pudo iniciar sesión', result?.message || 'Intenta nuevamente.');
      }
    } catch (error) {
      Alert.alert('⚠️ Error en login', error?.message || 'Error desconocido');
    }
  };

  return (
    <View>
      <View className="mt-4 flex flex-row items-center justify-center gap-x-3">
        <View className="h-[1px] flex-1 bg-general-100" />
        <Text className="text-lg">O inicia con Google</Text>
        <View className="h-[1px] flex-1 bg-general-100" />
      </View>

      <CustomButton
        title="Iniciar con Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image source={icons.google} resizeMode="contain" className="mx-2 h-5 w-5" />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
