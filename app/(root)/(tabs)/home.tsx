import { useUser, useAuth } from '@clerk/clerk-expo';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, Image, FlatList, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { icons } from '@/constants';
import { useAppSelector } from '@/store';

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

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['40%'];
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const { caratulaCompleta, checklistCompleta, fotograficoCompleto } = useAppSelector(
    (state) => state.str
  );
  const { mantenimientoCompleto } = useAppSelector((state) => state.mantenimiento);
  const { conectividadCompleto } = useAppSelector((state) => state.conectividad);

  const handleCerrarSesion = () => {
    bottomSheetRef.current?.close();
    setBottomSheetVisible(false);
    console.log('🚪 Finalizar turno');
    signOut();
    router.replace('/(auth)/sign-in');
  };

  useFocusEffect(
    useCallback(() => {
      return () => setBottomSheetVisible(false);
    }, [])
  );

  const consejos = [
    '✅ Sé ordenado: exporta cada formulario para liberar uno nuevo.',
    '📡 La app funciona sin conexión y también en línea.',
    '⏰ Te recordaremos los formularios pendientes por terminar.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % consejos.length;
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white px-5 pt-10">
        <View className="mb-6 flex flex-row items-center justify-between">
          <Text className="font-JakartaExtraBold text-2xl">Hola, {user?.firstName} 👋</Text>
          <TouchableOpacity
            onPress={() => setBottomSheetVisible(true)}
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <Image source={icons.out} className="h-5 w-5" />
          </TouchableOpacity>
        </View>

        {/* Conectividad */}
        <TouchableOpacity
          onPress={() => router.push('/conectividad/registro-conectividad')}
          className="relative w-full rounded-lg bg-sky-100 p-5 shadow-md"
          style={{ paddingRight: 20 }}>
          <Text className="text-left font-JakartaBold text-xl text-sky-600">
            Conectividad PCC a TDA y F
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            Registra la conectividad y el estado del equipo PCC para TDA y F.
          </Text>
          <RightIndicator ready={conectividadCompleto} />
        </TouchableOpacity>

        {/* STR */}
        <TouchableOpacity
          onPress={() => router.push('/str')}
          className="relative mt-6 w-full rounded-lg bg-sky-100 p-5 shadow-md"
          style={{ paddingRight: 20 }}>
          <Text className="text-left font-JakartaBold text-xl text-sky-600">
            Gabinetes y Baterías
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            Genera un reporte técnico detallado del sitio donde se realizará la intervención.
          </Text>
          <RightIndicator ready={caratulaCompleta && checklistCompleta && fotograficoCompleto} />
        </TouchableOpacity>

        {/* Mantenimiento */}
        <TouchableOpacity
          onPress={() => router.push('/mantenimiento/registro-mantenimiento')}
          className="relative mt-6 w-full rounded-lg bg-sky-100 p-5 shadow-md"
          style={{ paddingRight: 20 }}>
          <Text className="text-left font-JakartaBold text-xl text-sky-600">
            Mantenimiento Preventivo
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            Registra y gestiona las actividades de mantenimiento preventivo programadas.
          </Text>
          <RightIndicator ready={mantenimientoCompleto} />
        </TouchableOpacity>

        <View className="mt-10">
          <Text className="mb-3 font-JakartaBold text-sm text-sky-700">Consejos útiles</Text>

          <FlatList
            ref={listRef}
            data={consejos}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
              );
              setCurrentIndex(index);
            }}
            renderItem={({ item, index }) => (
              <View className="mr-4 w-[300px] items-center justify-center rounded-2xl bg-sky-100 px-5 py-6 shadow-md">
                <View className="mb-4">
                  {index === 0 && <FontAwesome name="check-square-o" size={36} color="#0284c7" />}
                  {index === 1 && <MaterialIcons name="wifi-off" size={36} color="#0284c7" />}
                  {index === 2 && <FontAwesome name="bell" size={36} color="#0284c7" />}
                </View>
                <Text className="text-center font-JakartaMedium text-base text-sky-700">
                  {item}
                </Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>

      {bottomSheetVisible && (
        <>
          {/* Fondo táctil para cerrar el BottomSheet */}
          <Pressable
            onPress={() => setBottomSheetVisible(false)}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            onChange={(index) => {
              if (index === -1) {
                setBottomSheetVisible(false);
              }
            }}>
            <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
              <Text className="mb-4 text-center font-JakartaBold text-lg">
                ¿Deseas finalizar tu turno?
              </Text>

              <TouchableOpacity
                onPress={handleCerrarSesion}
                className="mb-3 rounded-xl bg-red-100 px-4 py-3">
                <Text className="text-center font-JakartaMedium text-red-700">Finalizar turno</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setBottomSheetVisible(false)}
                className="rounded-xl bg-gray-100 px-4 py-3">
                <Text className="text-center font-JakartaMedium text-gray-700">Cancelar</Text>
              </TouchableOpacity>
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      )}
    </GestureHandlerRootView>
  );
};

export default Home;
