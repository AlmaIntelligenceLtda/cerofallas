import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { fetchAPI } from "@/lib/fetch";

const CARD_MARGIN = 8;
const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = (screenWidth - CARD_MARGIN * 3 - 32) / 2;

const FormularioCard = ({ item }: { item: any }) => {
  const goToForm = () => {
    if (item.form_tipo === "caratula" || item.form_tipo === "str") {
      router.push(`/str/caratula?form_id=${item.form_id}`);
    } else if (item.form_tipo === "checklist") {
      router.push(`/str/checklist?form_id=${item.form_id}`);
    } else if (item.form_tipo === "conectividad") {
      router.push(`/conectividad?form_id=${item.form_id}`);
    } else if (item.form_tipo === "mantenimiento") {
      router.push(`/mantenimiento?form_id=${item.form_id}`);
    } else {
      console.warn("Ruta desconocida:", item.form_tipo);
    }
  };

  return (
    <TouchableOpacity
      className="bg-white border border-gray-200 rounded-2xl p-4 m-1 items-center shadow-sm"
      style={{ minHeight: 130, width: CARD_WIDTH }}
      onPress={goToForm}
    >
      <View className="relative mb-2">
        <MaterialIcons name="insert-drive-file" size={42} color="#3b82f6" />
        <View className="absolute right-0 bottom-0 bg-white rounded-full p-1 shadow-sm">
          <FontAwesome name="exclamation-circle" size={16} color="orange" />
        </View>
      </View>
      <Text className="text-sm font-semibold text-center text-gray-800">
        {item.form_tipo}
      </Text>
      <Text className="text-xs text-gray-500 text-center mt-1">{item.fecha}</Text>
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
      const data = await fetchAPI(`/(api)/documentos/pendientes?userId=${userId}`);
      setFormularios(data);
    } catch (err) {
      console.error("Error al cargar formularios pendientes:", err);
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
      <Text className="text-2xl font-JakartaBold mb-5">
        Formularios pendientes
      </Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      ) : (
        <FlatList
          key="2cols"
          data={formularios}
          keyExtractor={(item) => `${item.form_id}`}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <FormularioCard item={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              No tienes formularios pendientes por ahora.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default FormulariosPendientes;
