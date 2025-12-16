import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams, router } from 'expo-router';
import debounce from 'lodash.debounce';
import { useState, useEffect } from 'react';
import { Text, View, Alert, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ChecklistItem from '@/components/ChecklistItem';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/InputField';
import { icons, ecebbItems } from '@/constants';
import { fetchAPI, fetchFormAPI } from '@/lib/fetch';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFotograficoCompleto, setFormIdFotografico, resetFotografico } from '@/store/strSlice';

const ChecklistFotograficoSection = () => {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { form_id } = useLocalSearchParams();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [progresoId, setProgresoId] = useState<string | null>(null);
  const [debeGuardar, setDebeGuardar] = useState(false);

  const { form_id_pendiente } = useAppSelector((state) => state.str.fotografico);

  // 🔄 Cargar progreso inicial
  useEffect(() => {
    if (!user?.id) return;
    const formIdUsar = form_id ?? form_id_pendiente;
    if (!formIdUsar) return;

    const cargarProgreso = async () => {
      try {
        const result = await fetchAPI(
          `/api/str/progreso/fotografico-get?userId=${user.id}&formId=${formIdUsar}`,
          {
            method: 'GET',
          }
        );

        console.log('📷 Fotos recuperadas:', result.photos);

        dispatch(setFotograficoCompleto(false));

        if (result?.form_data) {
          setFormData(result.form_data);
          const flatPhotos: Record<string, string> = {};
          for (const key in result.photos || {}) {
            const value = result.photos[key];
            flatPhotos[key] = typeof value === 'string' ? value : value?.[0]?.uri;
          }
          setPhotos(flatPhotos);
        }

        if (result?.id) {
          setProgresoId(result.id);
        }
      } catch (err) {
        console.error('Error al cargar progreso:', err);
      }
    };

    cargarProgreso();
  }, [user?.id, form_id, form_id_pendiente]);

  const handleChange = (field: string, option: string) => {
    setFormData((prev) => ({ ...prev, [field]: option }));
    setDebeGuardar(true);
  };

  const handlePhotoTaken = async (label: string, uri: string | null, forceSave?: boolean) => {
    setPhotos((prev) => {
      const next = { ...prev };
      if (uri) next[label] = uri;
      else delete next[label];
      return next;
    });
    setDebeGuardar(true);

    // 🚨 Guardado inmediato al borrar foto
    if (forceSave) {
      try {
        const form = new FormData();
        form.append('userId', user?.id || '');
        form.append(
          'formData',
          JSON.stringify({ ...formData, fotos: { ...photos, [label]: uri } })
        );
        if (progresoId) form.append('progresoId', progresoId);

        await fetchFormAPI('/api/str/progreso/fotografico-progress', form);
        console.log('🗑️ Foto eliminada guardada en backend:', label);
      } catch (err) {
        console.error('Error guardando eliminación de foto:', err);
      }
    }
  };

  const handleObservacionChange = (text: string) => {
    setFormData((prev) => ({ ...prev, observaciones: text }));
    setDebeGuardar(true);
  };

  const isChecklistCompleto = () => {
    const tieneObservaciones = formData['observaciones']?.trim() !== '';
    const todosItemsLlenos = ecebbItems.every((item) => formData[item]?.trim() !== '');
    return tieneObservaciones && todosItemsLlenos;
  };

  const guardarFormulario = async () => {
    const completo = isChecklistCompleto();

    try {
      const form = new FormData();
      form.append('userId', user?.id);
      form.append('formData', JSON.stringify({ ...formData, fotos: photos }));
      if (progresoId) form.append('progresoId', progresoId);

      Object.entries(photos).forEach(([key, uri]) => {
        if (!uri.startsWith('http')) {
          const file = {
            uri,
            name: `${key}.jpg`,
            type: 'image/jpeg',
          };
          form.append(key, file);
        }
      });

      await fetchFormAPI('/api/str/fotografico', form);

      if (completo) {
        dispatch(setFotograficoCompleto(true)); // ✅ Verde
        // Si quieres limpiar los datos solo cuando esté completo:
        setFormData({});
        setPhotos({});
        setProgresoId(null);
      } else {
        dispatch(setFotograficoCompleto(false)); // ✅ Naranja
      }

      dispatch(setFormIdFotografico(null));

      Alert.alert(
        'Formulario enviado correctamente',
        completo ? 'Formulario completo.' : 'Guardado como borrador (faltan campos).',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      Alert.alert('Hubo un problema al guardar.');
    }
  };

  // 💾 Auto-guardado progresivo
  useEffect(() => {
    if (!user?.id || !debeGuardar) return;

    const saveProgress = debounce(async () => {
      try {
        const form = new FormData();
        form.append('userId', user.id);
        form.append(
          'formData',
          JSON.stringify({ ...formData, fotos: photos }) // ✅ Incluye fotos actuales
        );
        form.append('formId', progresoId || '-1');

        Object.entries(photos).forEach(([key, uri]) => {
          if (!uri.startsWith('http')) {
            const fileName = uri.split('/').pop();
            const file = {
              uri,
              name: fileName,
              type: 'image/jpeg',
            } as any;
            form.append(key, file);
          }
        });

        const res = await fetchFormAPI('/api/str/progreso/fotografico-progress', form);

        dispatch(setFotograficoCompleto(false));

        if (res?.id && !progresoId) {
          setProgresoId(res.id);
        }

        if (res?.form_id) {
          dispatch(setFormIdFotografico(res.form_id));
        }

        setDebeGuardar(false);
      } catch (err) {
        console.error('Error auto-guardando:', err);
      }
    }, 1500);

    saveProgress();
    return () => saveProgress.cancel();
  }, [formData, photos, user?.id, debeGuardar]);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        className="flex-1 px-5"
        extraScrollHeight={Platform.OS === 'ios' ? 150 : 100}
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}>
        <Text className="mb-4 font-JakartaBold text-2xl text-sky-700">Fotográfico ECE y BB</Text>

        {ecebbItems.map((label) => (
          <ChecklistItem
            key={label}
            label={label}
            selectedOption={formData[label] || null}
            onSelectOption={(option) => handleChange(label, option)}
            onPhotoTaken={handlePhotoTaken}
            fotoActual={photos[label] || null}
          />
        ))}

        <Text className="mb-3 text-center font-JakartaBold text-lg text-black">Observaciones</Text>
        <InputField
          label="Observaciones generales"
          placeholder="Escribe una observación"
          icon={icons.note}
          multiline
          value={formData['observaciones'] || ''}
          onChangeText={handleObservacionChange}
        />

        <View className="mb-10 mt-6">
          <CustomButton title="Guardar" onPress={guardarFormulario} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChecklistFotograficoSection;
