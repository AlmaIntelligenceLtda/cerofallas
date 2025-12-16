import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';

type Foto = { uri: string };
type Props = {
  id: string;
  titulo: string;
  subtitulo: string;
  fotos: Foto[];
  onAddPhoto: (id: string, uri: string) => void;
  onRemovePhoto: (id: string, index: number) => void;
};

export default function FotograficoSection({
  id,
  titulo,
  subtitulo,
  fotos,
  onAddPhoto,
  onRemovePhoto,
}: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [textoEstampado, setTextoEstampado] = useState<string>('');
  const stampRef = useRef<View>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Activa la ubicación para continuar.');
      }
    };
    requestLocationPermission();
  }, []);

  const procesarImagen = async (
    uri: string,
    incluirUbicacion: boolean,
    fuente: 'camara' | 'galeria'
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

      if (fuente === 'camara' || incluirUbicacion) {
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

        onAddPhoto(id, final.uri);
      }
    } catch (e) {
      console.error('Error procesando la imagen:', e);
      Alert.alert('Error al procesar la imagen.');
    } finally {
      setPreviewImage(null);
      setTextoEstampado('');
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      await procesarImagen(result.assets[0].uri, true, 'camara');
    }
  };

  const pickFromGallery = async (incluirUbicacion: boolean) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      await procesarImagen(result.assets[0].uri, incluirUbicacion, 'galeria');
    }
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold">{titulo}</Text>
      <Text className="mb-2 text-sm text-gray-500">{subtitulo}</Text>

      <View className="mb-2 flex-row flex-wrap gap-3">
        {fotos.map((foto, index) => (
          <View key={`${id}-${index}`} className="relative">
            <Image
              source={{ uri: foto.uri }}
              style={{ width: 160, height: 160, borderRadius: 10 }}
            />
            <TouchableOpacity
              onPress={() => onRemovePhoto(id, index)}
              className="absolute -right-2 -top-2 z-10 h-7 w-7 items-center justify-center rounded-full bg-red-600">
              <Text className="text-xs font-bold text-white">✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {fotos.length === 0 && (
        <View className="flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={takePhoto}
            className="flex-1 rounded-lg bg-green-100 px-4 py-2">
            <Text className="text-center font-semibold text-green-700">Tomar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickFromGallery(false)}
            className="flex-1 rounded-lg bg-blue-100 px-4 py-2">
            <Text className="text-center font-semibold text-blue-700">Galería</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickFromGallery(true)}
            className="flex-1 rounded-lg bg-purple-100 px-4 py-2">
            <Text className="text-center font-semibold text-purple-700">Galería + ubicación</Text>
          </TouchableOpacity>
        </View>
      )}

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
