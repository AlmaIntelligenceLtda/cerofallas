import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import { checklistOptions } from '@/constants';

type Props = {
  label: string;
  selectedOption: string | null;
  onSelectOption: (value: string) => void;
  onPhotoTaken?: (label: string, uri: string | null, forceSave?: boolean) => void;
  fotoActual?: string | null;
};

export default function ChecklistItem({
  label,
  selectedOption,
  onSelectOption,
  onPhotoTaken,
  fotoActual,
}: Props) {
  const [photoUri, setPhotoUri] = useState<string | null>(fotoActual || null);

  useEffect(() => {
    if (fotoActual && fotoActual !== photoUri) {
      setPhotoUri(fotoActual);
    }
  }, [fotoActual]);

  const procesarImagen = async (uri: string, incluirUbicacion: boolean) => {
    try {
      const now = new Date();
      let texto = '';

      if (incluirUbicacion) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const fechaHora = now.toLocaleString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
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
${now.toLocaleString('es-CL')}`;
      }

      // 👉 Estampado con fondo negro semitransparente
      const final = await manipulateAsync(
        uri,
        [
          // Caja negra semitransparente detrás del texto
          {
            drawRect: {
              position: { x: 10, y: 20 },
              size: { width: 600, height: 220 }, // ajusta según el largo del texto
              color: 'rgba(0,0,0,0.6)',
            },
          },
          // El texto encima
          {
            drawText: {
              text: texto,
              position: { x: 20, y: 40 },
              color: 'white',
              fontSize: 26,
              anchor: 'top-left',
            },
          },
        ],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      setPhotoUri(final.uri);
      onPhotoTaken?.(label, final.uri);
    } catch (e) {
      console.error('Error procesando imagen:', e);
      Alert.alert('Error al procesar la imagen.');
    }
  };

  const tomarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await procesarImagen(result.assets[0].uri, true);
    }
  };

  const seleccionarGaleria = async (incluirUbicacion = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await procesarImagen(result.assets[0].uri, incluirUbicacion);
    }
  };

  const eliminarFoto = () => {
    setPhotoUri(null);
    onPhotoTaken?.(label, null, true); // ⚡ fuerza guardado en backend
  };

  return (
    <View className="mb-6 w-full">
      <Text className="mb-2 font-JakartaMedium text-black">{label}</Text>

      <View className="mb-2 flex-row gap-2">
        {checklistOptions.map(({ label: optLabel, value }) => (
          <TouchableOpacity
            key={value}
            onPress={() => onSelectOption(value)}
            className={`flex-1 items-center rounded-xl py-2 ${
              selectedOption === value
                ? 'border-[#FFCD00] bg-sky-300'
                : 'border border-gray-300 bg-general-800'
            }`}>
            <Text
              className={`font-JakartaMedium text-base ${
                selectedOption === value ? 'text-black' : 'text-white'
              }`}>
              {optLabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!photoUri && (
        <View className="flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={tomarFoto}
            className="flex-1 rounded-lg bg-green-100 px-4 py-2">
            <Text className="text-center font-semibold text-green-700">📷 Tomar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => seleccionarGaleria(false)}
            className="flex-1 rounded-lg bg-blue-100 px-4 py-2">
            <Text className="text-center font-semibold text-blue-700">📁 Galería</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => seleccionarGaleria(true)}
            className="flex-1 rounded-lg bg-purple-100 px-4 py-2">
            <Text className="text-center font-semibold text-purple-700">
              📍 Galería + ubicación
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {photoUri && (
        <View className="relative mt-2 h-[200px] w-[200px]">
          <Image
            source={{ uri: photoUri }}
            className="h-full w-full rounded-xl"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={eliminarFoto}
            className="absolute right-1 top-1 z-10 h-7 w-7 items-center justify-center rounded-full bg-red-600">
            <Text className="text-xs font-bold text-white">✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
