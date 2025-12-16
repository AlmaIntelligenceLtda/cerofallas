import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux'; // Usamos Redux para acceder al estado y despachar acciones

import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import WorkStatusCard from '@/components/WorkStatusCard';
import { setIsAuthenticated } from '@/store/authSlice'; // Acción de Redux

const RightIndicator = ({ ready }: { ready: boolean }) => (
  <View
    style={{
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: 8,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      backgroundColor: ready ? 'green' : 'orange',
    }}
  />
);

const Profile = () => {
  const dispatch = useDispatch(); // Usamos dispatch de Redux
  const { user } = useUser();
  const router = useRouter();

  // Usamos useAppSelector para acceder al estado de 'isAuthenticated'
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    // Verificamos si el usuario está autenticado y actualizamos el estado
    const isAuthenticatedMeta = !!user?.primaryEmailAddress;
    dispatch(setIsAuthenticated(isAuthenticatedMeta)); // Actualizamos el estado de autenticación
  }, [user, dispatch]);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="my-5 font-JakartaBold text-2xl">Mi perfil</Text>

        <View className="my-5 flex items-center justify-center">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" h-[110px] w-[110px] rounded-full border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="mt-6 flex flex-col items-start justify-center rounded-lg bg-white px-5 py-3 shadow-sm shadow-neutral-300">
          <View className="flex w-full flex-col items-start justify-start">
            <InputField
              label="Primer nombre"
              placeholder={user?.firstName || 'No especifica'}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Segundo nombre"
              placeholder={user?.lastName || 'No especifica'}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              label="Correo"
              placeholder={user?.primaryEmailAddress?.emailAddress || 'No especifica'}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
