import Icon from '@expo/vector-icons/MaterialIcons';
import { CameraView, Camera } from 'expo-camera';
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function QRScanner({
  onCodeRead,
  onClose,
}: {
  onCodeRead: (code: string) => void;
  onClose: () => void;
}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'torch'>('off');
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    onCodeRead(data);
  };

  if (hasPermission === null) {
    return <Text className="mt-10 text-center text-white">Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text className="mt-10 text-center text-red-500">Sin acceso a la cámara</Text>;
  }

  return (
    <View className="relative flex-1 items-center justify-center bg-black">
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr', 'pdf417'] }}
        style={StyleSheet.absoluteFillObject}
        enableTorch={flashMode === 'torch'}
      />

      <Text className="absolute top-14 px-4 text-center text-xl font-semibold text-white">
        Escanea el QR o credencial
      </Text>

      <Animated.View
        className="rounded-3xl border-4 border-white"
        style={{
          width: width * 0.65,
          height: width * 0.65,
          transform: [{ scale: animatedValue }],
        }}
      />

      {/* Botones juntos: flash, escanear, cerrar */}
      <View className="absolute bottom-24 flex-row space-x-8">
        {/* Linterna */}
        <TouchableOpacity
          onPress={() => setFlashMode(flashMode === 'off' ? 'torch' : 'off')}
          className="items-center justify-center rounded-full border border-white bg-white/25 p-4"
          activeOpacity={0.7}>
          <Icon
            name={flashMode === 'off' ? 'flashlight-off' : 'flashlight-on'}
            size={28}
            color="white"
          />
        </TouchableOpacity>

        {/* Escanear / Reintentar */}
        {scanned ? (
          <TouchableOpacity
            onPress={() => setScanned(false)}
            className="items-center justify-center rounded-full bg-white px-6 py-3"
            activeOpacity={0.8}>
            <Text className="text-base font-semibold text-black">Escanear nuevamente</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-16" /> // espacio vacío para mantener alineación
        )}

        {/* Cerrar / Volver */}
        <TouchableOpacity
          onPress={onClose}
          className="items-center justify-center rounded-full border border-white bg-white/25 p-4"
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
