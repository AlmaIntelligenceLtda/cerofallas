import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Animated, Easing, StyleSheet, Dimensions } from "react-native";
import { CameraView, Camera } from "expo-camera";
import Icon from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get("window");

export default function QRScanner({ onCodeRead, onClose }: { onCodeRead: (code: string) => void; onClose: () => void }) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const [flashMode, setFlashMode] = useState<"off" | "torch">("off");
    const animatedValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
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
        return <Text className="text-white text-center mt-10">Solicitando permiso de cámara...</Text>;
    }
    if (hasPermission === false) {
        return <Text className="text-red-500 text-center mt-10">Sin acceso a la cámara</Text>;
    }

    return (
        <View className="flex-1 bg-black relative items-center justify-center">
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr", "pdf417"] }}
                style={StyleSheet.absoluteFillObject}
                enableTorch={flashMode === "torch"}
            />

            <Text className="absolute top-14 text-white text-xl font-semibold px-4 text-center">
                Escanea el QR o credencial
            </Text>

            <Animated.View
                className="border-4 border-white rounded-3xl"
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
                    onPress={() => setFlashMode(flashMode === "off" ? "torch" : "off")}
                    className="bg-white/25 border border-white rounded-full p-4 items-center justify-center"
                    activeOpacity={0.7}
                >
                    <Icon
                        name={flashMode === "off" ? "flashlight-off" : "flashlight-on"}
                        size={28}
                        color="white"
                    />
                </TouchableOpacity>

                {/* Escanear / Reintentar */}
                {scanned ? (
                    <TouchableOpacity
                        onPress={() => setScanned(false)}
                        className="bg-white rounded-full px-6 py-3 items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-black font-semibold text-base">Escanear nuevamente</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="w-16" /> // espacio vacío para mantener alineación
                )}

                {/* Cerrar / Volver */}
                <TouchableOpacity
                    onPress={onClose}
                    className="bg-white/25 border border-white rounded-full p-4 items-center justify-center"
                    activeOpacity={0.7}
                >
                    <Icon name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
