import { useUser } from '@clerk/clerk-expo';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchAPI } from '@/lib/fetch';

const CARD_MARGIN = 8;
const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = (screenWidth - CARD_MARGIN * 3 - 32) / 2;

const FormularioCard = ({ item }: { item: any }) => {
  const goToForm = () => {
    const idParam = `form_id=${item.form_id}`;
    const tipo = item.form_tipo;

    if (tipo === 'caratula') {
      router.push(`/str/caratula?${idParam}`);
    } else if (tipo === 'checklist') {
      router.push(`/str/checklist?${idParam}`);
    } else if (tipo === 'fotografico') {
      router.push(`/str/fotografico?${idParam}`);
    } else if (tipo === 'conectividad') {
      router.push(`/conectividad?${idParam}`);
    } else if (tipo === 'mantenimiento') {
      router.push(`/mantenimiento/registro-mantenimiento?${idParam}`);
    } else {
      console.warn('Ruta desconocida:', tipo);
    }
  };

  return (
    <TouchableOpacity
      className="m-1 items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
      style={{ minHeight: 130, width: CARD_WIDTH }}
      onPress={goToForm}>
      <View className="relative mb-2">
        <MaterialIcons name="insert-drive-file" size={42} color="#3b82f6" />
        <View className="absolute bottom-0 right-0 rounded-full bg-white p-1 shadow-sm">
          <FontAwesome name="exclamation-circle" size={16} color="orange" />
        </View>
      </View>
      <Text className="text-center text-sm font-semibold text-gray-800">
        {item.titulo || item.form_tipo}
      </Text>
      <Text className="mt-1 text-center text-xs text-gray-500">{item.fecha}</Text>
    </TouchableOpacity>
  );
};

const FormulariosPendientes = () => {
  const { user } = useUser();
  const [formularios, setFormularios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendientes = async (userId: string, isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await fetchAPI(`/api/documentos/pendientes?userId=${userId}`, {
        method: 'GET',
      });
      setFormularios(data || []);
    } catch (err) {
      console.error('Error al cargar formularios pendientes:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPendientes(user.id);
  }, [user?.id]);

  const onRefresh = useCallback(() => {
    if (user?.id) {
      setRefreshing(true);
      fetchPendientes(user.id, true);
    }
  }, [user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-5">
      <Text className="mb-5 font-JakartaBold text-2xl">Formularios pendientes</Text>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      ) : (
        <FlatList
          key="2cols"
          data={formularios}
          keyExtractor={(item) => `${item.form_id}-${item.form_tipo}`}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => <FormularioCard item={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-gray-500">
              No tienes formularios pendientes por ahora.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FormulariosPendientes;
