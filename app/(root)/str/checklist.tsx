import { useUser } from '@clerk/clerk-expo';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { router, useLocalSearchParams } from 'expo-router';
import debounce from 'lodash.debounce';
import { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomButton from '@/components/CustomButton';
import { fetchAPI } from '@/lib/fetch';
import { useAppDispatch, useAppSelector } from '@/store'; // Usamos los hooks de Redux
import { setChecklist, setChecklistCompleta, resetChecklist } from '@/store/strSlice'; // Acciones de Redux

const siNoCampos = [
  'requiere4x4',
  'animales',
  'andamios',
  'grua',
  'colocalizado',
  'carroCanasta',
  'aperturaRadomo',
];

const Checklist = () => {
  const { checklist, checklistCompleta } = useAppSelector((state) => state.str); // Accedemos al estado de Redux
  const dispatch = useAppDispatch(); // Usamos dispatch de Redux
  const { form_id } = useLocalSearchParams();
  const { user } = useUser();

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['60%'], []);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [sheetMode, setSheetMode] = useState<'check' | 'voltaje'>('check');

  const [newItem, setNewItem] = useState({ tipo: '', estado: '', observacion: '' });
  const [newVoltaje, setNewVoltaje] = useState({ tipo: '', valor: '' });

  const [progresoId, setProgresoId] = useState<number | null>(null);

  const camposObligatorios = [
    'codigo',
    'nombre',
    'direccion',
    'nombreProfesional',
    'empresaAliada',
    'fechaEjecucion',
    'marcaRectificador',
    'modeloRectificador',
    'potenciaTotal',
    'modulosInstalados',
    'capacidadAmperes',
    'recarga5',
    'marcaGabinete',
    'modeloGabinete',
    'limpiezaGabinete',
    'anclajeGabinete',
    'climatizacion',
    'llavesEntregadas',
    'marcaBaterias',
    'modeloBaterias',
    'cantidadBancos',
    'capacidadBanco',
    'capacidadTotalBanco',
    'limpieza',
    'inspeccionBornes',
    'aprieteTorque',
    'pruebaRespaldo',
    'conectividadMeteo',
    'puestaServicio',
    'observaciones',
  ];

  const textFields = [
    'codigo',
    'nombre',
    'direccion',
    'nombreProfesional',
    'empresaAliada',
    'fechaEjecucion',
    'marcaRectificador',
    'modeloRectificador',
    'potenciaTotal',
    'modulosInstalados',
    'capacidadAmperes',
    'recarga5',
    'marcaGabinete',
    'modeloGabinete',
    'limpiezaGabinete',
    'anclajeGabinete',
    'climatizacion',
    'llavesEntregadas',
    'marcaBaterias',
    'modeloBaterias',
    'cantidadBancos',
    'capacidadBanco',
    'capacidadTotalBanco',
    'observaciones',
  ];

  const openSheet = (mode: 'check' | 'voltaje') => {
    setSheetMode(mode);
    if (mode === 'check') setNewItem({ tipo: '', estado: '', observacion: '' });
    else setNewVoltaje({ tipo: '', valor: '' });
    setBottomSheetVisible(true);
  };

  const handleChange = (field: string, value: string) => {
    dispatch(setChecklist({ [field]: value }));
  };

  const isChecklistCompleto = () => {
    const camposFaltantes = camposObligatorios.filter((campo) => {
      const valor = checklist[campo];
      if (typeof valor === 'string') return valor.trim() === '';
      return valor === null || valor === undefined;
    });

    const faltanItems =
      (!Array.isArray(checklist.checkItems) || checklist.checkItems.length === 0) &&
      (!Array.isArray(checklist.voltajes) || checklist.voltajes.length === 0);

    return camposFaltantes.length === 0 && !faltanItems;
  };

  const handleGuardar = async () => {
    if (!checklist.codigo || !checklist.nombre || !checklist.nombreProfesional) {
      Alert.alert('Completa los campos obligatorios.');
      return;
    }

    const completo = isChecklistCompleto();

    try {
      await fetchAPI('/api/str/checklist', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          progresoId,
          ...checklist,
        }),
      });

      if (completo) {
        dispatch(resetChecklist()); // ✅ Limpia si está completo
        dispatch(setChecklistCompleta(true)); // ✅ Verde
      } else {
        dispatch(setChecklistCompleta(false)); // ✅ Naranja
      }

      Alert.alert(
        'Checklist guardado correctamente',
        completo ? 'Formulario completo.' : 'Guardado como borrador (faltan campos).',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Hubo un problema al guardar el checklist.');
    }
  };

  const handleSaveItem = () => {
    if (!newItem.tipo || !newItem.estado) {
      Alert.alert('Selecciona tipo y estado antes de guardar.');
      return;
    }
    dispatch(setChecklist({ checkItems: [...(checklist.checkItems || []), newItem] }));
    setBottomSheetVisible(false);
  };

  const handleSaveVoltaje = () => {
    if (!newVoltaje.tipo || !newVoltaje.valor) {
      Alert.alert('Selecciona tipo y valor antes de guardar.');
      return;
    }
    dispatch(setChecklist({ voltajes: [...(checklist.voltajes || []), newVoltaje] }));
    setBottomSheetVisible(false);
  };

  // Auto-guardado
  useEffect(() => {
    if (!user?.id || !checklist.codigo || !checklist.nombre) return;

    const saveProgress = debounce(async () => {
      try {
        const result = await fetchAPI('/api/str/progreso/checklist-progress', {
          method: 'POST',
          body: JSON.stringify({
            userId: user.id,
            titulo: checklist.nombre,
            formData: checklist,
            progresoId,
          }),
        });

        dispatch(setChecklistCompleta(false));

        if (result?.id && !progresoId) {
          setProgresoId(result.id); // ⬅️ guardar el ID de str_progreso
        }
      } catch (error) {
        console.error('Error auto-guardando progreso:', error);
      }
    }, 1500);

    saveProgress();
    return () => saveProgress.cancel();
  }, [checklist, user?.id, progresoId]);

  // Cargar progreso si form_id === -1
  useEffect(() => {
    if (!user?.id || form_id !== '-1') return;

    const loadProgress = async () => {
      try {
        const data = await fetchAPI(
          `/api/str/progreso/checklist-get?userId=${user.id}&formId=${form_id}`,
          {
            method: 'GET',
          }
        );

        dispatch(setChecklistCompleta(false));

        if (data?.form_data) dispatch(setChecklist(data.form_data));
      } catch (error) {
        console.error('Error al cargar progreso del checklist:', error);
      }
    };

    loadProgress();
  }, [form_id, user?.id, dispatch]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        className="flex-1 bg-white px-5 pt-6"
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Text className="mb-4 font-JakartaBold text-2xl text-sky-700">
          Checklist Gabinetes y Baterías
        </Text>

        {textFields.map((field) => (
          <View key={field} className="mb-4">
            <Text className="mb-1 font-JakartaMedium text-base capitalize text-gray-700">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <TextInput
              className="rounded-lg border border-gray-300 px-4 py-2"
              value={checklist[field]}
              onChangeText={(v) => handleChange(field, v)}
              placeholder={`Ingresa ${field}`}
            />
          </View>
        ))}

        {/* CHECK ITEMS */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="font-JakartaBold text-lg text-gray-700">Checklist</Text>
          <TouchableOpacity
            onPress={() => openSheet('check')}
            className="rounded-lg bg-sky-600 px-4 py-2">
            <Text className="text-sm text-white">+ Agregar ítem</Text>
          </TouchableOpacity>
        </View>

        {(checklist.checkItems || []).map((item, i) => (
          <View key={i} className="mb-3 rounded-lg border border-gray-300 p-3">
            <Text className="text-gray-800">
              🧾 <Text className="font-bold">{item.tipo}</Text>
            </Text>
            <Text>Estado: {item.estado}</Text>
            <Text>Observación: {item.observacion}</Text>
            <TouchableOpacity
              className="mt-2 self-end"
              onPress={() =>
                dispatch(
                  setChecklist({
                    checkItems: checklist.checkItems.filter((_, idx) => idx !== i),
                  })
                )
              }>
              <Text className="text-sm text-red-600">🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* VOLTAJES */}
        <View className="mb-4 mt-6 flex-row items-center justify-between">
          <Text className="font-JakartaBold text-lg text-gray-700">Voltajes</Text>
          <TouchableOpacity
            onPress={() => openSheet('voltaje')}
            className="rounded-lg bg-sky-600 px-4 py-2">
            <Text className="text-sm text-white">+ Agregar voltaje</Text>
          </TouchableOpacity>
        </View>

        {(checklist.voltajes || []).map((v, i) => (
          <View key={i} className="mb-3 rounded-lg border border-gray-300 p-3">
            <Text className="text-gray-800">
              🔌 <Text className="font-bold">{v.tipo}</Text>
            </Text>
            <Text>Valor: {v.valor}</Text>
            <TouchableOpacity
              className="mt-2 self-end"
              onPress={() =>
                dispatch(
                  setChecklist({
                    voltajes: checklist.voltajes.filter((_, idx) => idx !== i),
                  })
                )
              }>
              <Text className="text-sm text-red-600">🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))}

        <CustomButton title="Guardar checklist" className="mt-6" onPress={handleGuardar} />
      </ScrollView>

      {/* Bottom Sheet */}
      {bottomSheetVisible && (
        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => setBottomSheetVisible(false)}>
          <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
            {sheetMode === 'check' ? (
              <>
                <Text className="mb-2 font-JakartaBold text-lg">Tipo de revisión</Text>
                {[
                  'limpieza',
                  'inspeccionBornes',
                  'aprieteTorque',
                  'pruebaRespaldo',
                  'conectividadMeteo',
                  'puestaServicio',
                ].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    onPress={() => setNewItem((prev) => ({ ...prev, tipo }))}
                    className={`mb-2 rounded-lg border p-3 ${newItem.tipo === tipo ? 'border-sky-500 bg-sky-100' : 'border-gray-300'}`}>
                    <Text>{tipo.replace(/([A-Z])/g, ' $1').trim()}</Text>
                  </TouchableOpacity>
                ))}

                <Text className="mb-2 mt-4 font-JakartaBold text-lg">Estado</Text>
                {['OK', 'NO', 'NA'].map((estado) => (
                  <TouchableOpacity
                    key={estado}
                    onPress={() => setNewItem((prev) => ({ ...prev, estado }))}
                    className={`mb-2 rounded-lg border p-3 ${newItem.estado === estado ? 'border-sky-500 bg-sky-100' : 'border-gray-300'}`}>
                    <Text className="text-center">{estado}</Text>
                  </TouchableOpacity>
                ))}

                <Text className="mb-2 mt-4 font-JakartaBold text-lg">Observación</Text>
                <TextInput
                  className="rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Escribe una observación"
                  value={newItem.observacion}
                  onChangeText={(v) => setNewItem((prev) => ({ ...prev, observacion: v }))}
                />

                <CustomButton title="Guardar ítem" className="mt-6" onPress={handleSaveItem} />
              </>
            ) : (
              <>
                <Text className="mb-2 font-JakartaBold text-lg">Tipo de voltaje</Text>
                {[
                  'voltajeFlote',
                  'voltajeBanco1',
                  'voltajeBanco2',
                  'voltajeBanco3',
                  'voltajeBanco4',
                ].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    onPress={() => setNewVoltaje((prev) => ({ ...prev, tipo }))}
                    className={`mb-2 rounded-lg border p-3 ${newVoltaje.tipo === tipo ? 'border-sky-500 bg-sky-100' : 'border-gray-300'}`}>
                    <Text>{tipo.replace(/([A-Z])/g, ' $1').trim()}</Text>
                  </TouchableOpacity>
                ))}

                <Text className="mb-2 mt-4 font-JakartaBold text-lg">Valor</Text>
                <TextInput
                  className="rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Ej: 52.7"
                  keyboardType="decimal-pad"
                  value={newVoltaje.valor}
                  onChangeText={(v) => setNewVoltaje((prev) => ({ ...prev, valor: v }))}
                />

                <CustomButton
                  title="Guardar voltaje"
                  className="mt-6"
                  onPress={handleSaveVoltaje}
                />
              </>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  );
};

export default Checklist;
