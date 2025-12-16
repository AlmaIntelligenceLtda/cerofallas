import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { useAppDispatch, useAppSelector } from '@/store';
import { setMantenimiento } from '@/store/mantenimientoSlice';

export default function RegistroFotografico() {
  const dispatch = useAppDispatch();
  const { mantenimiento } = useAppSelector((state) => state.mantenimiento);

  const stampRef = useRef<View>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [textoEstampado, setTextoEstampado] = useState<string>('');

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  const procesarImagen = async (
    uri: string,
    index: number,
    incluirUbicacion = false,
    esCamara = false
  ) => {
    try {
      let texto = '';
      const now = new Date();
      const fechaHora = now.toLocaleString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      if (esCamara || incluirUbicacion) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const direccion = reverse[0];
        texto = `${fechaHora}
${direccion.street || ''} ${direccion.name || ''}
${direccion.district || ''} ${direccion.region || ''}
${direccion.country || ''}
Altitud: ${location.coords.altitude?.toFixed(1)}m
Velocidad: ${location.coords.speed?.toFixed(1) || 0} km/h`;
      } else {
        texto = `Importada de galería
${fechaHora}`;
      }

      setPreviewImage(uri);
      setTextoEstampado(texto);

      // 🔧 Esperamos render completo
      await new Promise((res) => setTimeout(res, 500));

      if (stampRef.current) {
        const stampedUri = await captureRef(stampRef.current, {
          format: 'jpg',
          quality: 0.9,
        });

        const final = await manipulateAsync(stampedUri, [], {
          compress: 0.8,
          format: SaveFormat.JPEG,
        });

        const copia = Array.isArray(mantenimiento.fotografico)
          ? [...mantenimiento.fotografico]
          : [];
        if (copia[index]) {
          copia[index] = { ...copia[index], uri: final.uri };
        }
        dispatch(setMantenimiento({ fotografico: copia }));
      }
    } catch (e) {
      console.error('Error procesando imagen:', e);
      Alert.alert('Error al procesar la imagen.');
    } finally {
      setPreviewImage(null);
      setTextoEstampado('');
    }
  };

  const takePhoto = async (index: number) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      await procesarImagen(result.assets[0].uri, index, false, true);
    }
  };

  const pickFromGallery = async (index: number, incluirUbicacion = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      await procesarImagen(result.assets[0].uri, index, incluirUbicacion, false);
    }
  };

  const handleChangeFoto = (index: number, field: 'campo' | 'descripcion', value: string) => {
    const nuevaLista = (mantenimiento.fotografico || []).map((foto, i) =>
      i === index ? { ...foto, [field]: value } : { ...foto }
    );
    dispatch(setMantenimiento({ fotografico: nuevaLista }));
  };

  const agregarNuevaFoto = () => {
    const nueva = { campo: '', descripcion: '', uri: '' };
    const listaActual = Array.isArray(mantenimiento.fotografico) ? mantenimiento.fotografico : [];
    dispatch(setMantenimiento({ fotografico: [...listaActual, nueva] }));
  };

  const eliminarFoto = (index: number) => {
    const nuevaLista = (mantenimiento.fotografico || []).filter((_, i) => i !== index);
    dispatch(setMantenimiento({ fotografico: nuevaLista }));
  };

  return (
    <View className="mt-4">
      <Text className="mb-2 font-JakartaSemiBold text-lg text-sky-600">Registro Fotográfico</Text>

      {(mantenimiento.fotografico || []).map((item, index) => (
        <View key={index} className="mb-5 rounded-lg border border-gray-300 p-3">
          <TextInput
            placeholder="Nombre del campo"
            value={item.campo}
            onChangeText={(v) => handleChangeFoto(index, 'campo', v)}
            className="mb-2 rounded border border-gray-300 px-3 py-2"
          />
          <TextInput
            placeholder="Descripción"
            value={item.descripcion}
            onChangeText={(v) => handleChangeFoto(index, 'descripcion', v)}
            className="mb-2 rounded border border-gray-300 px-3 py-2"
          />
          {item.uri ? (
            <View
              style={{
                width: '100%',
                height: 300,
                marginBottom: 10,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: '#eee',
              }}>
              <Image
                source={{ uri: item.uri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          ) : null}

          <View>
            {/* Fila superior */}
            <View className="mb-3 flex-row justify-between">
              <TouchableOpacity
                onPress={() => takePhoto(index)}
                className="mr-2 flex-1 rounded bg-green-100 px-4 py-2">
                <Text className="text-center font-semibold text-green-700">📷 Foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => pickFromGallery(index, false)}
                className="ml-2 flex-1 rounded bg-blue-100 px-4 py-2">
                <Text className="text-center font-semibold text-blue-700">📁 Galería</Text>
              </TouchableOpacity>
            </View>

            {/* Fila inferior */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => pickFromGallery(index, true)}
                className="mr-2 flex-1 rounded bg-purple-100 px-4 py-2">
                <Text className="text-center font-semibold text-purple-700">
                  📍 Galería + Ubicación
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => eliminarFoto(index)}
                className="ml-2 flex-1 rounded bg-red-100 px-4 py-2">
                <Text className="text-center font-semibold text-red-700">❌ Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity onPress={agregarNuevaFoto} className="mb-6 rounded-lg bg-sky-100 px-4 py-3">
        <Text className="text-center font-semibold text-sky-700">+ Agregar Foto</Text>
      </TouchableOpacity>

      {previewImage && (
        <View
          key={previewImage}
          collapsable={false}
          ref={stampRef}
          style={{
            position: 'absolute',
            top: -1000,
            width: 1080,
            height: 1080,
            backgroundColor: 'black',
          }}>
          <Image
            source={{ uri: previewImage }}
            style={{ width: 1080, height: 1080 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              alignItems: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: 12,
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 28,
                lineHeight: 36,
                textAlign: 'right',
              }}>
              {textoEstampado}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
