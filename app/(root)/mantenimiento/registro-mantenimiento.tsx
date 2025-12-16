import { useUser } from '@clerk/clerk-expo';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import debounce from 'lodash.debounce';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomButton from '@/components/CustomButton';
import RegistroFotografico from '@/components/RegistroFotografico';
import { fetchAPI, fetchFormAPI } from '@/lib/fetch';
import { useAppDispatch, useAppSelector } from '@/store';
import { setMantenimiento, resetTodo, setMantenimientoCompleto } from '@/store/mantenimientoSlice';

const siNoCampos = ['adjuntaComprobante'];
const tipoMantenimientoCampo = 'tipoMantenimiento';

const Mantenimiento = () => {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { form_id } = useLocalSearchParams();
  const { mantenimiento } = useAppSelector((state) => state.mantenimiento);

  const [progresoId, setProgresoId] = useState<number | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [campoActual, setCampoActual] = useState<string | null>(null);
  const snapPoints = useMemo(() => ['25%'], []);

  const handleChange = useCallback(
    (key: keyof typeof mantenimiento, value: string) => {
      dispatch(setMantenimiento({ [key]: value }));
    },
    [dispatch]
  );

  const isFormularioCompleto = useCallback(() => {
    const obligatorios = ['nombreSitio', 'codigoSitio', 'direccion', 'ciudad', 'region'];
    return obligatorios.every((campo) => {
      const valor = mantenimiento[campo as keyof typeof mantenimiento];
      return valor?.trim() !== '' && valor !== 'Seleccionar...';
    });
  }, [mantenimiento]);

  const handleGuardar = async () => {
    const completo = isFormularioCompleto();
    dispatch(setMantenimientoCompleto(completo));

    if (!completo) {
      Alert.alert('Guardado como borrador', 'Aún faltan campos obligatorios.');
      return;
    }

    try {
      const form = new FormData();
      form.append('user_id', user?.id || '');
      form.append('progreso_id', progresoId || '');
      form.append('formData', JSON.stringify(mantenimiento));

      (mantenimiento.fotografico || []).forEach((foto, i) => {
        if (foto.uri && !foto.uri.startsWith('http')) {
          form.append(`foto_${i}`, {
            uri: foto.uri,
            name: `foto_${i}.jpg`,
            type: 'image/jpeg',
          } as any);
        }
      });

      await fetchFormAPI('/api/mantenimiento/guardar', form);
      dispatch(resetTodo());
      dispatch(setMantenimientoCompleto(true));
      Alert.alert('Formulario guardado correctamente', '', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error('Error al guardar:', err);
      Alert.alert('Hubo un problema al guardar.');
    }
  };

  useEffect(() => {
    if (!user?.id || form_id !== '-1') return;

    const cargarProgreso = async () => {
      try {
        const result = await fetchAPI(
          `/api/mantenimiento/progreso/mto_preventivo-get?userId=${user.id}&formId=${form_id}`,
          {
            method: 'GET',
          }
        );

        dispatch(setMantenimientoCompleto(false));

        if (result?.form_data) {
          dispatch(setMantenimiento(result.form_data));
          if (result.id) setProgresoId(result.id);
        }
      } catch (error) {
        console.error('Error al cargar progreso guardado:', error);
      }
    };

    cargarProgreso();
  }, [user?.id, form_id, dispatch]);

  useEffect(() => {
    if (!user?.id || !mantenimiento.nombreSitio || !mantenimiento.codigoSitio) {
      console.warn('⚠️ No se cumple condición mínima para guardar progreso');
      return;
    }

    const saveProgress = debounce(async () => {
      try {
        const result = await fetchAPI('/api/mantenimiento/progreso/mto_preventivo', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            formData: mantenimiento,
            progresoId,
          }),
        });

        dispatch(setMantenimientoCompleto(false));

        if (result?.id && !progresoId) {
          console.log('✅ Nuevo progresoId asignado:', result.id);
          setProgresoId(result.id);
        }
      } catch (error) {
        console.error('❌ Error auto-guardando mantenimiento:', error);
      }
    }, 1500);

    saveProgress();

    return () => {
      console.log('🧼 Cancelando debounce...');
      saveProgress.cancel();
    };
  }, [mantenimiento, user?.id, progresoId]);

  const seleccionarOpcion = (valor: string) => {
    if (!campoActual) return;
    dispatch(setMantenimiento({ [campoActual]: valor }));
    setBottomSheetVisible(false);
    bottomSheetRef.current?.close();
  };

  const renderInput = (
    label: string,
    key: keyof typeof mantenimiento,
    options?: { keyboardType?: any; multiline?: boolean }
  ) => (
    <View className="mb-4">
      <Text className="mb-1 font-JakartaMedium text-base text-gray-700">{label}</Text>
      <TextInput
        value={mantenimiento[key]}
        onChangeText={(v) => handleChange(key, v)}
        placeholder={`Ingresa ${label.toLowerCase()}`}
        keyboardType={options?.keyboardType || 'default'}
        multiline={options?.multiline || false}
        numberOfLines={options?.multiline ? 4 : 1}
        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800"
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-white px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="mb-4 text-center font-JakartaBold text-2xl text-sky-700">
          Registro de Mantenimiento
        </Text>

        {renderInput('Nombre Sitio', 'nombreSitio')}
        {renderInput('Código Sitio', 'codigoSitio')}
        {renderInput('Dirección', 'direccion')}
        {renderInput('Ciudad', 'ciudad')}
        {renderInput('Región', 'region')}
        {renderInput('ID Acceso 1', 'idAcceso1')}
        {renderInput('ID Acceso 2', 'idAcceso2')}
        {renderInput('CRQ', 'numeroCrq')}
        {renderInput('Incidencia', 'numeroIncidencia')}
        {renderInput('Empresa Ejecutante', 'empresaEjecutante')}
        {renderInput('Nombre Técnico', 'nombreTecnico')}
        {renderInput('Supervisor', 'nombreSupervisor')}
        {renderInput('Fecha Ejecución', 'fechaEjecucion')}
        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">
          Datos del Equipo
        </Text>
        {renderInput('Tipo de Equipo', 'tipoEquipo')}
        {renderInput('Marca', 'marcaEquipo')}
        {renderInput('N° Serie', 'numeroSerie')}

        <TouchableOpacity
          onPress={() => {
            setCampoActual(tipoMantenimientoCampo);
            setBottomSheetVisible(true);
            bottomSheetRef.current?.expand();
          }}
          className="mb-3 rounded-lg border border-gray-300 p-3">
          <Text className="text-gray-700">Tipo de Mantenimiento:</Text>
          <Text className="text-base font-semibold text-black">
            {mantenimiento.tipoMantenimiento || 'Seleccionar...'}
          </Text>
        </TouchableOpacity>

        {renderInput('Horómetro', 'horometro')}
        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">
          Resumen del Trabajo
        </Text>
        {renderInput('Resumen', 'resumenTrabajo', { multiline: true })}

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
              {mantenimiento[campo] || 'Seleccionar...'}
            </Text>
          </TouchableOpacity>
        ))}

        {renderInput('Cantidad de Hojas', 'cantidadHojas', { keyboardType: 'numeric' })}

        <Text className="mb-2 mt-6 font-JakartaSemiBold text-lg text-sky-600">Observaciones</Text>
        {renderInput('Observaciones', 'observaciones', { multiline: true })}

        <RegistroFotografico />

        <CustomButton title="Guardar formulario" className="mt-8" onPress={handleGuardar} />
      </ScrollView>

      {bottomSheetVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => setBottomSheetVisible(false)}>
          <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
            <Text className="mb-4 text-center text-lg font-bold">Selecciona una opción</Text>
            {(campoActual === tipoMantenimientoCampo
              ? ['Preventivo', 'Correctivo']
              : ['Sí', 'No']
            ).map((op) => (
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

export default Mantenimiento;
