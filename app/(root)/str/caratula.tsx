import { useUser } from '@clerk/clerk-expo';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import debounce from 'lodash.debounce';
import { useEffect, useState, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { fetchAPI } from '@/lib/fetch';
import { useAppDispatch, useAppSelector } from '@/store'; // Usamos los hooks de Redux
import { setCaratula, setCaratulaCompleta, resetCaratula } from '@/store/strSlice'; // Acciones de Redux

const siNoCampos = [
  'requiere4x4',
  'animales',
  'andamios',
  'grua',
  'colocalizado',
  'carroCanasta',
  'aperturaRadomo',
];

const Caratula = () => {
  const { user } = useUser();
  const { form_id } = useLocalSearchParams();

  const dispatch = useAppDispatch(); // Usamos dispatch de Redux
  const { caratula, caratulaCompleta } = useAppSelector((state) => state.str); // Usamos el estado de Redux

  const [progresoId, setProgresoId] = useState<number | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%'], []);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [campoActual, setCampoActual] = useState<string | null>(null);

  const handleChange = (key: keyof typeof caratula, value: string) => {
    dispatch(setCaratula({ ...caratula, [key]: value }));
  };

  const isCaratulaCompleta = () => {
    const obligatorios = ['siteId', 'siteName', 'direccion', 'comuna', 'region'];

    const todosCompletos = obligatorios.every(
      (campo) => caratula[campo]?.trim() !== '' && caratula[campo] !== 'Seleccionar...'
    );

    const siNoCompletos = siNoCampos.every((campo) => caratula[campo] !== null);

    return todosCompletos && siNoCompletos;
  };

  const handleGuardar = async () => {
    const completo = isCaratulaCompleta();
    dispatch(setCaratulaCompleta(completo));

    if (!completo) {
      Alert.alert('Guardado como borrador', 'Aún faltan campos obligatorios.');
      return;
    }

    try {
      const response = await fetchAPI('/api/str/caratula', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          progresoId,
          ...caratula,
        }),
      });

      dispatch(resetCaratula()); // Limpiamos la carátula
      dispatch(setCaratulaCompleta(true));

      Alert.alert('Formulario guardado correctamente', '', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error('Error al guardar carátula:', error);
      Alert.alert('Hubo un problema al guardar', error?.message || JSON.stringify(error));
    }
  };

  useEffect(() => {
    if (!user?.id || form_id !== '-1') return;

    const cargarProgreso = async () => {
      try {
        const result = await fetchAPI(
          `/api/str/progreso/caratula-get?userId=${user.id}&formId=${form_id}`,
          {
            method: 'GET',
          }
        );

        dispatch(setCaratulaCompleta(false));

        if (result?.form_data) {
          dispatch(setCaratula(result.form_data));
          if (result.id) setProgresoId(result.id);
        }
      } catch (error) {
        console.error('Error al cargar progreso guardado:', error);
      }
    };

    cargarProgreso();
  }, [user?.id, form_id, dispatch]);

  useEffect(() => {
    if (!user?.id || !caratula.siteName || !caratula.siteId) return;

    const saveProgress = debounce(async () => {
      try {
        const result = await fetchAPI('/api/str/progreso/caratula-progress', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            siteName: caratula.siteName,
            formData: caratula,
            progresoId,
          }),
        });

        dispatch(setCaratulaCompleta(false));

        if (result?.id && !progresoId) {
          setProgresoId(result.id);
        }
      } catch (error) {
        console.error('Error auto-guardando progreso:', error);
      }
    }, 1500);

    saveProgress();
    return () => saveProgress.cancel();
  }, [caratula, user?.id, progresoId]);

  const seleccionarOpcion = (valor: string) => {
    if (!campoActual) return;
    dispatch(setCaratula({ ...caratula, [campoActual]: valor }));
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  const obtenerGPS = async (tipo: 'sitio' | 'porton') => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede acceder al GPS.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude.toFixed(6);
      const lon = location.coords.longitude.toFixed(6);

      if (tipo === 'sitio') {
        dispatch(setCaratula({ latitudGps: lat, longitudGps: lon }));
      } else {
        dispatch(setCaratula({ latitudPorton: lat, longitudPorton: lon }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-white px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="mb-4 text-center font-JakartaBold text-2xl text-sky-700">
          Formulario de Carátula
        </Text>

        <Text className="mb-2 font-JakartaSemiBold text-lg text-sky-600">
          Información del Sitio
        </Text>
        <Field
          label="Site ID"
          value={caratula.siteId}
          onChangeText={(v) => handleChange('siteId', v)}
        />
        <Field
          label="Site Name"
          value={caratula.siteName}
          onChangeText={(v) => handleChange('siteName', v)}
        />
        <Field
          label="Dirección"
          value={caratula.direccion}
          onChangeText={(v) => handleChange('direccion', v)}
        />
        <Field
          label="Comuna"
          value={caratula.comuna}
          onChangeText={(v) => handleChange('comuna', v)}
        />
        <Field
          label="Región"
          value={caratula.region}
          onChangeText={(v) => handleChange('region', v)}
        />
        <Field
          label="Tipo Sitio"
          value={caratula.tipoSitio}
          onChangeText={(v) => handleChange('tipoSitio', v)}
        />
        <Field
          label="Estructura"
          value={caratula.estructura}
          onChangeText={(v) => handleChange('estructura', v)}
        />
        <Field
          label="Altura (m)"
          value={caratula.altura}
          onChangeText={(v) => handleChange('altura', v)}
          keyboardType="numeric"
        />

        {/* Nuevo campo para Operadora */}
        <Field
          label="Operadora"
          value={caratula.operadora}
          onChangeText={(v) => handleChange('operadora', v)}
        />

        {/* Nuevo campo para Propietario de la Estructura */}
        <Field
          label="Propietario de la Estructura"
          value={caratula.propietario_estructura}
          onChangeText={(v) => handleChange('propietario_estructura', v)}
        />

        {/* Nuevo campo para Código dueño de la estructura */}
        <Field
          label="Código dueño de la estructura"
          value={caratula.codigo_dueno_estructura}
          onChangeText={(v) => handleChange('codigo_dueno_estructura', v)}
        />

        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">Coordenadas GPS</Text>
        <Field
          label="Latitud GPS"
          value={caratula.latitudGps}
          onChangeText={(v) => handleChange('latitudGps', v)}
        />
        <Field
          label="Longitud GPS"
          value={caratula.longitudGps}
          onChangeText={(v) => handleChange('longitudGps', v)}
        />
        <TouchableOpacity
          onPress={() => obtenerGPS('sitio')}
          className="mb-4 rounded-lg bg-blue-500 p-3">
          <Text className="text-center text-white">Obtener coordenadas del sitio</Text>
        </TouchableOpacity>

        <Field
          label="Latitud Portón"
          value={caratula.latitudPorton}
          onChangeText={(v) => handleChange('latitudPorton', v)}
        />
        <Field
          label="Longitud Portón"
          value={caratula.longitudPorton}
          onChangeText={(v) => handleChange('longitudPorton', v)}
        />
        <TouchableOpacity
          onPress={() => obtenerGPS('porton')}
          className="mb-4 rounded-lg bg-blue-500 p-3">
          <Text className="text-center text-white">Obtener coordenadas del portón</Text>
        </TouchableOpacity>

        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">
          Técnico Responsable
        </Text>
        <Field
          label="Nombre IC"
          value={caratula.nombreIc}
          onChangeText={(v) => handleChange('nombreIc', v)}
        />
        <Field
          label="Celular IC"
          value={caratula.celularIc}
          onChangeText={(v) => handleChange('celularIc', v)}
          keyboardType="phone-pad"
        />

        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">
          Condiciones de Acceso
        </Text>
        {siNoCampos.map((campo) => (
          <TouchableOpacity
            key={campo}
            onPress={() => {
              setCampoActual(campo);
              setBottomSheetVisible(true);
              bottomSheetRef.current?.expand();
            }}
            className="mb-3 rounded-lg border border-gray-300 p-3">
            <Text className="text-gray-700">{campo.replace(/([A-Z])/g, ' $1')}:</Text>
            <Text className="text-base font-semibold text-black">
              {caratula[campo] || 'Seleccionar...'}
            </Text>
          </TouchableOpacity>
        ))}

        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">Observaciones</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Escribe aquí cualquier detalle adicional del sitio..."
          value={caratula.observaciones}
          onChangeText={(v) => handleChange('observaciones', v)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-700"
        />

        <CustomButton title="Guardar carátula" className="mt-8" onPress={handleGuardar} />
      </ScrollView>

      {/* BottomSheet solo visible cuando se activa */}
      {bottomSheetVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => setBottomSheetVisible(false)}>
          <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
            <Text className="mb-4 text-center text-lg font-bold">Selecciona una opción</Text>
            {['Sí', 'No'].map((op) => (
              <TouchableOpacity
                key={op}
                onPress={() => seleccionarOpcion(op)}
                className="border-b border-gray-200 px-4 py-3">
                <Text className="text-center text-base">{op}</Text>
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

const Field = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
}) => (
  <View className="mb-4">
    <Text className="mb-1 font-JakartaMedium text-base text-gray-700">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholder={`Ingresa ${label.toLowerCase()}`}
      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
    />
  </View>
);

export default Caratula;
