import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const Str = () => {
  const { caratulaCompleta, checklistCompleta, fotograficoCompleto } = useAppSelector(
    (state) => state.str
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-6">
          {/* Carátula */}
          <TouchableOpacity
            onPress={() => router.push('/str/caratula')}
            className="relative w-full rounded-lg bg-sky-50 p-5 shadow-md"
            style={{ paddingRight: 20 }}>
            <Text className="text-left font-JakartaBold text-xl text-sky-600">Carátula</Text>
            <Text className="mt-1 text-sm text-gray-500">
              Genera el formulario correspondiente.
            </Text>
            <RightIndicator ready={caratulaCompleta} />
          </TouchableOpacity>

          {/* Checklist */}
          <TouchableOpacity
            onPress={() => router.push('/str/checklist')}
            className="relative mt-6 w-full rounded-lg bg-sky-50 p-5 shadow-md"
            style={{ paddingRight: 20 }}>
            <Text className="text-left font-JakartaBold text-xl text-sky-600">Checklist</Text>
            <Text className="mt-1 text-sm text-gray-500">
              Verifica el estado de los gabinetes y baterías. Agrega fotografías si es necesario.
            </Text>
            <RightIndicator ready={checklistCompleta} />
          </TouchableOpacity>

          {/* Checklist Fotográfico ECE y BB */}
          <TouchableOpacity
            onPress={() => router.push('/str/fotografico')}
            className="relative mt-6 w-full rounded-lg bg-sky-50 p-5 shadow-md"
            style={{ paddingRight: 20 }}>
            <Text className="text-left font-JakartaBold text-xl text-sky-600">
              Checklist Fotográfico ECE y BB
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Verifica las condiciones del equipo ECE y BB. Agrega fotografías si es necesario.
            </Text>
            <RightIndicator ready={fotograficoCompleto} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Str;
