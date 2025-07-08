import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { fetchAPI } from "@/lib/fetch";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RNBlobUtil from "react-native-blob-util";

const DocumentoCard = ({ item, onPress }: { item: any; onPress: () => void }) => (
  <TouchableOpacity
    className="bg-gray-100 rounded-xl p-4 mr-4 w-40 items-center justify-center"
    onPress={onPress}
  >
    <View className="relative mb-2">
      <MaterialIcons name="insert-drive-file" size={40} color="#888" />
      <View className="absolute right-0 bottom-0 bg-white rounded-full p-1">
        {item.estado === "listo" ? (
          <FontAwesome name="check-circle" size={16} color="green" />
        ) : (
          <FontAwesome name="exclamation-circle" size={16} color="orange" />
        )}
      </View>
    </View>
    <Text className="text-sm font-semibold text-center">
      {item.titulo ?? item.form_tipo?.toUpperCase() ?? "SIN TÍTULO"}
    </Text>
    <Text className="text-xs text-gray-500 text-center mt-1">{item.fecha}</Text>
  </TouchableOpacity>
);

const SeccionDocumentos = ({
  title,
  data,
  onPressDocumento,
}: {
  title: string;
  data: any[];
  onPressDocumento: (item: any) => void;
}) => (
  <View className="mb-6">
    <Text className="text-lg font-JakartaBold mb-2 text-sky-600">{title}</Text>
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <DocumentoCard item={item} onPress={() => onPressDocumento(item)} />
      )}
    />
  </View>
);

const TrabajosListos = () => {
  const { user } = useUser();

  const [conectividad, setConectividad] = useState([]);
  const [str, setStr] = useState([]);
  const [mantenimiento, setMantenimiento] = useState([]);
  const [loading, setLoading] = useState(true);

  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<any>(null);
  const [modoEnvio, setModoEnvio] = useState<"correo" | "whatsapp" | null>(null);
  const [destinatario, setDestinatario] = useState("");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["45%"];

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const descargarDocumento = async (item: any) => {
    try {
      const { form_id, form_tipo } = item;
      const fileName = `documento_${form_tipo}_${form_id}.pdf`;
      const path = `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

      const res = await fetch(`/(api)/documentos/pdf?form_tipo=${form_tipo}&id=${form_id}`);
      const blob = await res.blob();
      const base64 = await blobToBase64(blob);

      await RNBlobUtil.fs.writeFile(path, base64, "base64");

      await RNBlobUtil.android.actionViewIntent(path, "application/pdf"); // opcional

      console.log("✅ Documento guardado en:", path);
    } catch (err) {
      console.error("❌ Error al generar y guardar el PDF:", err);
    }
  };

  const handleEnviar = async () => {
    if (!documentoSeleccionado) return;

    const url = `/(api)/documentos/pdf?form_tipo=${documentoSeleccionado.form_tipo}&id=${documentoSeleccionado.form_id}`;

    if (modoEnvio === "whatsapp") {
      const texto = `Aquí tienes el documento: ${url}`;
      await Linking.openURL(`whatsapp://send?phone=${destinatario}&text=${encodeURIComponent(texto)}`);
    } else {
      await fetchAPI("/(api)/documentos/enviar-correo", {
        method: "POST",
        body: JSON.stringify({
          correo: destinatario,
          url_pdf: url,
          asunto: "Documento STR",
        }),
      });
    }

    await fetchAPI("/(api)/documentos/marcar-enviado", {
      method: "PATCH",
      body: JSON.stringify({
        form_id: documentoSeleccionado.form_id,
        form_tipo: documentoSeleccionado.form_tipo,
      }),
    });

    bottomSheetRef.current?.close();
    setModoEnvio(null);
    setDestinatario("");
  };

  const openAcciones = (item: any) => {
    setDocumentoSeleccionado(item);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    const fetchListos = async () => {
      try {
        if (!user?.id) return;
        const res = await fetchAPI(`/(api)/documentos/listos?userId=${user.id}`);
        setConectividad(res.conectividad || []);
        setStr(res.str || []);
        setMantenimiento(res.mantenimiento || []);
      } catch (error) {
        console.error("Error al cargar trabajos listos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListos();
  }, [user?.id]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white px-5 pt-5">
        <Text className="text-2xl font-JakartaBold mb-5">Documentos</Text>

        {loading ? (
          <Text className="text-center text-gray-500 mt-10">Cargando documentos...</Text>
        ) : (
          <>
            <SeccionDocumentos
              title="📡 Conectividad PCC a TDA y F"
              data={conectividad}
              onPressDocumento={openAcciones}
            />
            <SeccionDocumentos
              title="📄 Site Technical Report (STR)"
              data={str}
              onPressDocumento={openAcciones}
            />
            <SeccionDocumentos
              title="🛠️ Mantenimiento Preventivo"
              data={mantenimiento}
              onPressDocumento={openAcciones}
            />
          </>
        )}

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
        >
          <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
            <Text className="text-lg font-bold mb-4 text-center">
              ¿Qué deseas hacer con este documento?
            </Text>

            <TouchableOpacity
              className="mb-3 bg-sky-500 p-3 rounded-lg"
              onPress={() => {
                if (documentoSeleccionado) {
                  descargarDocumento(documentoSeleccionado);
                  bottomSheetRef.current?.close();
                }
              }}
            >
              <Text className="text-white text-center">📥 Descargar documento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mb-3 bg-green-500 p-3 rounded-lg"
              onPress={() => setModoEnvio("whatsapp")}
            >
              <Text className="text-white text-center">💬 Enviar por WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mb-3 bg-blue-500 p-3 rounded-lg"
              onPress={() => setModoEnvio("correo")}
            >
              <Text className="text-white text-center">📧 Enviar por Correo</Text>
            </TouchableOpacity>

            {modoEnvio && (
              <>
                <TextInput
                  className="border border-gray-300 rounded-md px-4 py-2 mt-4 mb-2"
                  value={destinatario}
                  onChangeText={setDestinatario}
                  keyboardType={modoEnvio === "correo" ? "email-address" : "phone-pad"}
                  placeholder={
                    modoEnvio === "correo"
                      ? "ej: cliente@correo.com"
                      : "ej: +56912345678"
                  }
                />
                <TouchableOpacity className="bg-sky-600 p-3 rounded-md" onPress={handleEnviar}>
                  <Text className="text-white text-center font-bold">Enviar</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              className="mt-5 border border-gray-300 p-2 rounded-md"
              onPress={() => bottomSheetRef.current?.close()}
            >
              <Text className="text-center text-gray-500">Cancelar</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default TrabajosListos;
