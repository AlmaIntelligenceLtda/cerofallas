import { useUser, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { icons } from "@/constants";
import { useSTRStore } from "@/store/strStore";
import { FlatList } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

const RightIndicator = ({ ready }: { ready: boolean }) => (
  <View
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 8,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      backgroundColor: ready ? "green" : "orange",
    }}
  />
);

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["40%"];
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const {
    caratulaCompleta,
    checklistCompleta,
    setCaratulaCompleta,
    setChecklistCompleta,
  } = useSTRStore();

  useEffect(() => {
    const fetchProgreso = async () => {
      const res = await fetch(`https://api.tuapp.com/str/progreso/${user?.id}`);
      const data = await res.json();

      setCaratulaCompleta(data.caratula === true);
      setChecklistCompleta(data.checklist === true);
    };

    fetchProgreso();

    // Limpiar BottomSheet al desmontar
    return () => {
      setBottomSheetVisible(false);
    };
  }, []);

  const handleCerrarSesion = (motivo: string) => {
    bottomSheetRef.current?.close();
    setBottomSheetVisible(false);

    switch (motivo) {
      case "baño":
        console.log("⏱ Pausa por baño");
        break;
      case "cambio":
        console.log("🔁 Cambio de máquina");
        break;
      case "colacion":
        console.log("🔁 Pausa por colación");
        break;
      case "finalizar":
        console.log("🚪 Finalizar turno");
        signOut();
        router.replace("/(auth)/sign-in");
        break;
    }
  };

  const consejos = [
    "✅ Sé ordenado: exporta cada formulario para liberar uno nuevo.",
    "📡 La app funciona sin conexión y también en línea.",
    "⏰ Te recordaremos los formularios pendientes por terminar.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  // Avanza automáticamente cada 5 segundos
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
        <View className="flex flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-JakartaExtraBold">Hola, {user?.firstName} 👋</Text>
          <TouchableOpacity
            onPress={() => setBottomSheetVisible(true)}
            className="justify-center items-center w-10 h-10 rounded-full bg-gray-200"
          >
            <Image source={icons.out} className="w-5 h-5" />
          </TouchableOpacity>
        </View>

        {/* Conectividad */}
        <TouchableOpacity
          onPress={() => router.push("/conectividad")}
          className="bg-sky-100 rounded-lg shadow-md p-5 w-full relative"
          style={{ paddingRight: 20 }}
        >
          <Text className="text-xl font-JakartaBold text-sky-600 text-left">
            Conectividad PCC a TDA y F
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Registra la conectividad y el estado del equipo PCC para TDA y F.
          </Text>
          <RightIndicator ready={false} />
        </TouchableOpacity>

        {/* STR */}
        <TouchableOpacity
          onPress={() => router.push("/str")}
          className="bg-sky-100 rounded-lg shadow-md p-5 w-full relative mt-6"
          style={{ paddingRight: 20 }}
        >
          <Text className="text-xl font-JakartaBold text-sky-600 text-left">
            Gabinetes y Baterías
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Genera un reporte técnico detallado del sitio donde se realizará la intervención.
          </Text>
          <RightIndicator ready={caratulaCompleta && checklistCompleta} />
        </TouchableOpacity>

        {/* Mantenimiento */}
        <TouchableOpacity
          onPress={() => router.push("/mantenimiento")}
          className="bg-sky-100 rounded-lg shadow-md p-5 w-full relative mt-6"
          style={{ paddingRight: 20 }}
        >
          <Text className="text-xl font-JakartaBold text-sky-600 text-left">
            Mantenimiento Preventivo
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Registra y gestiona las actividades de mantenimiento preventivo programadas.
          </Text>
          <RightIndicator ready={false} />
        </TouchableOpacity>

        <View className="mt-10">
          <Text className="text-sm font-JakartaBold mb-3 text-sky-700">Consejos útiles</Text>

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
              <View className="bg-sky-100 rounded-2xl shadow-md px-5 py-6 mr-4 w-[300px] items-center justify-center">
                <View className="mb-4">
                  {index === 0 && (
                    <FontAwesome name="check-square-o" size={36} color="#0284c7" />
                  )}
                  {index === 1 && (
                    <MaterialIcons name="wifi-off" size={36} color="#0284c7" />
                  )}
                  {index === 2 && (
                    <FontAwesome name="bell" size={36} color="#0284c7" />
                  )}
                </View>
                <Text className="text-base font-JakartaMedium text-sky-700 text-center">
                  {item}
                </Text>
              </View>
            )}
          />
        </View>

      </SafeAreaView>

      {/* BottomSheet solo si está activo */}
      {bottomSheetVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => setBottomSheetVisible(false)}
        >
          <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
            <Text className="text-center font-JakartaBold text-lg mb-4">
              ¿Por qué deseas cerrar o pausar sesión?
            </Text>

            {["colacion", "baño", "finalizar"].map((motivo) => (
              <TouchableOpacity
                key={motivo}
                onPress={() => handleCerrarSesion(motivo)}
                className={`py-3 px-4 rounded-xl mb-3 ${motivo === "finalizar" ? "bg-red-100" : "bg-sky-100"
                  }`}
              >
                <Text
                  className={`text-center ${motivo === "finalizar" ? "text-red-700" : "text-sky-700"
                    } font-JakartaMedium`}
                >
                  {motivo === "colacion"
                    ? "Pausa por colación"
                    : motivo === "baño"
                      ? "Pausa por baño"
                      : "Finalizar turno"}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setBottomSheetVisible(false)}
              className="py-3 px-4 bg-gray-100 rounded-xl"
            >
              <Text className="text-center text-gray-700 font-JakartaMedium">Cancelar</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default Home;
