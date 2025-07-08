import React, { useRef, useEffect } from "react";
import { View, Text, Animated, Easing, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const DriverIdleView = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            className="flex-1 items-center justify-center px-6"
            style={{ opacity: fadeAnim }}
        >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View className="bg-purple-100 p-6 rounded-full shadow-md">
                    <FontAwesome name="plug" size={42} color="#8B5CF6" />
                </View>
            </Animated.View>

            <Text className="mt-6 text-xl font-semibold text-gray-700 text-center">
                Desconectado
            </Text>
            <Text className="text-gray-500 text-center mt-2">
                Mantente conectado para recibir viajes de grúa
            </Text>
            <View className="mt-10 flex-row items-center">
                <ActivityIndicator size="small" color="#7C3AED" />
                <Text className="text-purple-700 text-base ml-3">
                    Esperando conexión...
                </Text>
            </View>
        </Animated.View>
    );
};

export default DriverIdleView;
