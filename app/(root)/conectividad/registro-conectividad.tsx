import { useUser } from '@clerk/clerk-expo';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import debounce from 'lodash.debounce';
import { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ConectividadInfo from '@/components/ConectividadInfo';
import CustomButton from '@/components/CustomButton';
import FotograficoSection from '@/components/FotograficoSection';
import ResumenMediciones from '@/components/ResumenMediciones';
import { fotograficoSections } from '@/constants/fotograficoSections';
import { fetchAPI, fetchFormAPI } from '@/lib/fetch';
import { useAppDispatch, useAppSelector } from '@/store'; // Usamos Redux
import {
  setConectividad,
  setConectividadCompleto,
  setResumenMediciones,
  setFormIdPendiente,
  resetConectividad,
} from '@/store/conectividadSlice'; // Acciones de Redux

const siNoCampos = [
  'requiere4x4',
  'animales',
  'andamios',
  'grua',
  'colocalizado',
  'carroCanasta',
  'aperturaRadomo',
];

const Conectividad = () => {
  const dispatch = useAppDispatch(); // Usamos dispatch de Redux
  const { user } = useUser();
  const { form_id } = useLocalSearchParams();

  const {
    conectividad,
    conectividadCompleto,
    resumenMedicionesAntes,
    resumenMedicionesDespues,
    form_id_pendiente,
  } = useAppSelector((state) => state.conectividad); // Usamos el estado de Redux

  const [progresoId, setProgresoId] = useState<number | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%'], []);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [campoActual, setCampoActual] = useState<string | null>(null);
  const [fotos, setFotos] = useState<{ [campo: string]: { uri: string }[] }>({});

  const handleChange = (key: keyof typeof conectividad, value: string) => {
    dispatch(setConectividad({ [key]: value }));
  };

  const isConectividadCompleta = () => {
    const obligatorios = ['siteId', 'siteName', 'direccion', 'comuna', 'region', 'tipoSitio'];
    const completos = obligatorios.every(
      (campo) => conectividad[campo]?.trim() !== '' && conectividad[campo] !== 'Seleccionar...'
    );
    const siNoListos = siNoCampos.every(
      (campo) => conectividad[campo] !== null && conectividad[campo] !== undefined
    );
    return completos && siNoListos;
  };

  const handleGuardar = async () => {
    try {
      const form = new FormData();

      form.append('user_id', user?.id || '');
      form.append('progreso_id', progresoId || '');

      const fotosSanitizadas: Record<string, { uri: string }[]> = {};

      Object.entries(fotos).forEach(([campoOriginal, arr]) => {
        const campo = campoOriginal.replace(/\s+/g, '_').toLowerCase();
        fotosSanitizadas[campo] = [];

        arr.forEach((f, index) => {
          if (f.uri) {
            if (!f.uri.startsWith('http')) {
              const ext = f.uri.split('.').pop() || 'jpg';
              const fileFieldName = `foto_${campo}_${index}`;
              form.append(fileFieldName, {
                uri: f.uri,
                name: `${fileFieldName}.${ext}`,
                type: `image/${ext}`,
              } as any);
            }

            fotosSanitizadas[campo].push({ uri: f.uri });
          }
        });
      });

      form.append(
        'formData',
        JSON.stringify({
          ...conectividad,
          resumenMedicionesAntes,
          resumenMedicionesDespues,
          fotos: fotosSanitizadas,
        })
      );

      const res = await fetchFormAPI('/api/conectividad/guardar', form);

      dispatch(resetConectividad()); // ✅ limpia campos
      setFotos({}); // ✅ limpia fotos
      dispatch(setConectividadCompleto(true)); // ✅ marca como completado en Redux

      Alert.alert('Formulario guardado correctamente', '', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error('❌ Error al guardar conectividad:', err);
      Alert.alert('Hubo un problema al guardar.');
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const formIdUsar = form_id ?? form_id_pendiente;
    if (!formIdUsar) return;

    const cargarProgreso = async () => {
      try {
        const result = await fetchAPI(
          `/api/conectividad/progreso/conectividad-get?userId=${user.id}&formId=${formIdUsar}`,
          {
            method: 'GET',
          }
        );

        if (result?.form_data) {
          dispatch(setConectividad(result.form_data)); // Despachamos la acción de Redux
          setFotos(result.photos || {}); // Establecer fotos cargadas previamente
        }

        if (result?.id) {
          setProgresoId(result.id);
        }
      } catch (err) {
        console.error('❌ Error al cargar progreso:', err);
      }
    };

    cargarProgreso();
  }, [user?.id, form_id, dispatch]);

  useEffect(() => {
    if (!user?.id) return;

    const saveProgress = debounce(async () => {
      const completo = isConectividadCompleta(); // ✅ Evalúa completitud actual
      dispatch(setConectividadCompleto(completo)); // ✅ Actualiza Redux

      try {
        const form = new FormData();

        form.append('user_id', user?.id || '');
        form.append('progreso_id', progresoId || '');

        // Convertir fotos (objeto con secciones) en objeto tipo { campo: [ { uri } ] }
        const fotosSanitizadas: Record<string, { uri: string }[]> = {};

        Object.entries(fotos).forEach(([campoOriginal, arr]) => {
          const campo = campoOriginal.replace(/\s+/g, '_').toLowerCase(); // normalizar clave
          fotosSanitizadas[campo] = [];

          arr.forEach((f, index) => {
            if (f.uri) {
              // Adjuntar la foto real si no es URL
              if (!f.uri.startsWith('http')) {
                const ext = f.uri.split('.').pop() || 'jpg';
                const fileFieldName = `foto_${campo}_${index}`;
                form.append(fileFieldName, {
                  uri: f.uri,
                  name: `${fileFieldName}.${ext}`,
                  type: `image/${ext}`,
                });
              }

              fotosSanitizadas[campo].push({ uri: f.uri });
            }
          });
        });

        form.append(
          'formData',
          JSON.stringify({
            ...conectividad,
            resumenMedicionesAntes,
            resumenMedicionesDespues,
            fotos: fotosSanitizadas,
          })
        );

        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 segundo de retraso

        const res = await fetchFormAPI('/api/conectividad/progreso/conectividad-progress', form);

        console.log('respuesta form id: ', res?.form_id);

        if (res?.id && !progresoId) {
          setProgresoId(res.id);
        }
        if (res?.form_id) {
          dispatch(setFormIdPendiente(res.form_id));
        }
      } catch (err) {
        console.error('Error auto-guardando conectividad:', err);
      }
    }, 1500);

    saveProgress();
    return () => saveProgress.cancel();
  }, [conectividad, fotos, user?.id, progresoId]);

  const seleccionarOpcion = (valor: string) => {
    if (!campoActual) return;
    dispatch(setConectividad({ [campoActual]: valor })); // Despachamos la acción correctamente
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
        dispatch(setConectividad({ latitudGps: lat, longitudGps: lon }));
      } else {
        dispatch(setConectividad({ latitudPorton: lat, longitudPorton: lon }));
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
        <ConectividadInfo
          conectividad={conectividad}
          onChange={handleChange}
          onObtenerGPS={obtenerGPS}
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
              {conectividad[campo] || 'Seleccionar...'}
            </Text>
          </TouchableOpacity>
        ))}

        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">Observaciones</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Escribe aquí cualquier detalle adicional del sitio..."
          value={conectividad.observaciones}
          onChangeText={(v) => handleChange('observaciones', v)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-700"
        />

        <Text className="mb-4 mt-10 font-JakartaBold text-xl text-sky-700">
          Checklist Fotográfico
        </Text>
        {fotograficoSections.map((sec) => (
          <FotograficoSection
            key={sec.id}
            id={sec.id}
            titulo={sec.titulo}
            subtitulo={sec.subtitulo}
            fotos={fotos[sec.id] || []}
            onAddPhoto={(id, uri) => {
              const nuevas = [...(fotos[id] || []), { uri }];
              setFotos((prev) => ({ ...prev, [id]: nuevas }));
            }}
            onRemovePhoto={(id, index) => {
              const nuevas = [...(fotos[id] || [])];
              nuevas.splice(index, 1);
              setFotos((prev) => ({ ...prev, [id]: nuevas }));
            }}
          />
        ))}

        <ResumenMediciones
          tipo="antes"
          datos={resumenMedicionesAntes}
          onChange={(campo, valor) =>
            dispatch(setResumenMediciones({ tipo: 'antes', campo, valor }))
          }
        />

        <ResumenMediciones
          tipo="despues"
          datos={resumenMedicionesDespues}
          onChange={(campo, valor) =>
            dispatch(setResumenMediciones({ tipo: 'despues', campo, valor }))
          }
        />

        <CustomButton title="Guardar formulario" className="mb-10 mt-8" onPress={handleGuardar} />
      </ScrollView>

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

export default Conectividad;
