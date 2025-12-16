import { useUser } from '@clerk/clerk-expo';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Pressable,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchAPI } from '@/lib/fetch';
import {
  generarHTMLChecklist,
  generarHTMLCaratula,
  generarHTMLFotografico,
  generarHTMLMantenimiento,
  generarHTMLConectividad,
} from '@/lib/pdfTemplates';

type Documento = {
  form_id: number;
  form_tipo: string;
  titulo?: string;
  fecha?: string;
  estado?: 'listo' | 'pendiente';
  [key: string]: any;
};

const DocumentoCard = ({ item, onPress }: { item: Documento; onPress: () => void }) => (
  <TouchableOpacity
    className="mr-4 w-40 items-center justify-center rounded-xl bg-gray-100 p-4"
    onPress={onPress}>
    <View className="relative mb-2">
      <MaterialIcons name="insert-drive-file" size={40} color="#888" />
      <View className="absolute bottom-0 right-0 rounded-full bg-white p-1">
        {item.estado === 'listo' ? (
          <FontAwesome name="check-circle" size={16} color="green" />
        ) : (
          <FontAwesome name="exclamation-circle" size={16} color="orange" />
        )}
      </View>
    </View>
    <Text className="text-center text-sm font-semibold">
      {item.titulo ?? item.form_tipo?.toUpperCase() ?? 'SIN TÍTULO'}
    </Text>
    <Text className="mt-1 text-center text-xs text-gray-500">{item.fecha}</Text>
  </TouchableOpacity>
);

const SeccionDocumentos = ({
  title,
  data,
  onPressDocumento,
}: {
  title: string;
  data: Documento[];
  onPressDocumento: (item: Documento) => void;
}) => (
  <View className="mb-6">
    <Text className="mb-2 font-JakartaBold text-lg text-sky-600">{title}</Text>
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <DocumentoCard item={item} onPress={() => onPressDocumento(item)} />
      )}
    />
  </View>
);

function construirNombreArchivo(item: Documento): string {
  // Fecha al formato dd-mm-yyyy
  const fechaObj = item.fecha ? new Date(item.fecha.split('/').reverse().join('-')) : new Date();
  const fechaFormateada = `${fechaObj.getDate().toString().padStart(2, '0')}-${(fechaObj.getMonth() + 1).toString().padStart(2, '0')}-${fechaObj.getFullYear()}`;

  switch (item.form_tipo) {
    case 'conectividad':
      return `Informe Conectividad ${item.site_name ?? ''} ${item.site_id ?? item.codigo_dueno_estructura ?? ''} ${fechaFormateada}.pdf`;

    case 'mantenimiento':
      return `Informe Mantenimiento ${item.tipo_mantenimiento ?? ''} ${item.nombre_sitio ?? ''} ${item.codigo_sitio ?? ''} ${fechaFormateada}.pdf`;

    case 'caratula':
      return `Carátula ${item.site_name ?? ''} ${item.site_id ?? ''} ${fechaFormateada}.pdf`;

    case 'checklist':
      return `Checklist ${item.nombre ?? ''} ${item.codigo ?? ''} ${fechaFormateada}.pdf`;

    case 'fotografico':
      return `Registro Fotográfico ${item.site_name ?? ''} ${item.codigo_sitio ?? item.id ?? ''} ${fechaFormateada}.pdf`;

    default:
      return `Documento ${item.form_tipo ?? ''} ${fechaFormateada}.pdf`;
  }
}

const DocumentosScreen = () => {
  const { user } = useUser();

  const [conectividad, setConectividad] = useState<Documento[]>([]);
  const [str, setStr] = useState<Documento[]>([]);
  const [mantenimiento, setMantenimiento] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<Documento | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ['45%'];

  const fetchListos = async () => {
    if (!user?.id) return;
    try {
      const res = await fetchAPI(`/api/documentos/listos?userId=${user.id}`, {
        method: 'GET',
      });

      setConectividad(res.conectividad || []);
      setStr(res.str || []);
      setMantenimiento(res.mantenimiento || []);
    } catch (err) {
      console.error('❌ Error al cargar documentos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListos();
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setBottomSheetVisible(false);
      };
    }, [])
  );

  const generarPDF = async (item: Documento): Promise<string | null> => {
    try {
      let html = '';
      switch (item.form_tipo) {
        case 'caratula':
          console.log('item caratula: ', item);
          html = generarHTMLCaratula(item);
          break;
        case 'checklist':
          console.log('item checklist: ', item);
          html = generarHTMLChecklist(item);
          break;
        case 'fotografico':
          console.log('item fotografico: ', item);
          html = generarHTMLFotografico(item);
          break;
        case 'mantenimiento':
          console.log('item mantenimiento: ', item);
          html = generarHTMLMantenimiento(item);
          break;
        case 'conectividad':
          console.log('item conectividad: ', item);
          html = generarHTMLConectividad(item);
          break;
        default:
          html = `<html><body><h1>Documento sin plantilla</h1></body></html>`;
      }

      const { uri } = await Print.printToFileAsync({ html });
      const fileName = construirNombreArchivo(item);
      const filePath = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({ from: uri, to: filePath });
      return filePath;
    } catch (err) {
      console.error('❌ Error al generar PDF:', err);
      Alert.alert('Error', 'No se pudo generar el PDF.');
      return null;
    }
  };

  const openAcciones = (item: Documento) => {
    setDocumentoSeleccionado(item);
    setBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  const handleSheetClose = () => {
    setBottomSheetVisible(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white px-5 pt-5">
        <Text className="mb-5 font-JakartaBold text-2xl">Documentos</Text>

        {loading ? (
          <Text className="mt-10 text-center text-gray-500">Cargando documentos...</Text>
        ) : (
          <FlatList
            ListHeaderComponent={
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
            }
            data={[]} // vacío porque solo usamos ListHeaderComponent
            renderItem={null}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchListos();
                }}
              />
            }
          />
        )}

        {bottomSheetVisible && (
          <>
            {/* Fondo táctil para cerrar el BottomSheet */}
            <Pressable
              onPress={closeBottomSheet}
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
                  handleSheetClose();
                }
              }}>
              <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                <Text className="mb-4 text-center text-lg font-bold">Generar documento</Text>

                <TouchableOpacity
                  className="mb-3 rounded-lg bg-sky-500 p-3"
                  onPress={async () => {
                    if (documentoSeleccionado) {
                      const filePath = await generarPDF(documentoSeleccionado);
                      if (filePath && (await Sharing.isAvailableAsync())) {
                        await Sharing.shareAsync(filePath);
                      }
                    }
                  }}>
                  <Text className="text-center text-white">📄 Generar PDF local</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="mt-5 rounded-md border border-gray-300 p-2"
                  onPress={closeBottomSheet}>
                  <Text className="text-center text-gray-500">Cancelar</Text>
                </TouchableOpacity>
              </BottomSheetScrollView>
            </BottomSheet>
          </>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DocumentosScreen;
