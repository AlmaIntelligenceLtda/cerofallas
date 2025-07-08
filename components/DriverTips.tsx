// components/DriverTips.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Text, View, ActivityIndicator, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Tip {
    title: string;
    description: string;
}

interface DriverTipsProps {
    tips?: Tip[];
    interval?: number;
    loadingText?: string;
}

const DEFAULT_TIPS: Tip[] = [
    {
        title: "Sujeción Segura",
        description: "Verifica que las correas de sujeción estén bien colocadas antes de mover el vehículo"
    },
    {
        title: "Mantenimiento",
        description: "Mantén tu grúa en perfecto estado mecánico para evitar fallas en servicio"
    },
    {
        title: "Equipo de Protección",
        description: "Usa siempre chaleco reflectante, casco y guantes de seguridad"
    },
    {
        title: "Comunicación Clara",
        description: "Explica al cliente cada paso del proceso de carga y transporte"
    },
    {
        title: "Área de Trabajo",
        description: "Señaliza adecuadamente la zona de operación con conos y triángulos"
    },
    {
        title: "Puntos de Anclaje",
        description: "Identifica los puntos correctos para sujetar el vehículo según su modelo"
    },
    {
        title: "Límites de Carga",
        description: "Nunca excedas la capacidad máxima de peso de tu equipo"
    },
    {
        title: "Inspección Visual",
        description: "Revisa el vehículo por daños antes y después del transporte"
    }
];

const DriverTips: React.FC<DriverTipsProps> = ({
    tips = DEFAULT_TIPS,
    interval = 7000,
}) => {
    const [currentTip, setCurrentTip] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(width)).current;

    useEffect(() => {
        const tipInterval = setInterval(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -width,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setCurrentTip((prev) => (prev + 1) % tips.length);
                slideAnim.setValue(width);

                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 800,
                        easing: Easing.out(Easing.back(1)),
                        useNativeDriver: true,
                    })
                ]).start();
            });
        }, interval);

        return () => clearInterval(tipInterval);
    }, [tips.length, interval]);

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 p-8">
            <Animated.View
                className="bg-white p-7 rounded-2xl w-full max-w-md"
                style={{
                    transform: [{ translateX: slideAnim }],
                    opacity: fadeAnim,
                    shadowColor: "#8B5CF6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                <View className="flex-row items-start mb-4">
                    <View className="bg-purple-100 p-4 rounded-full mr-4">
                        <MaterialIcons name="local-shipping" size={28} color="#7C3AED" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-purple-800">
                            {tips[currentTip].title}
                        </Text>
                        <View className="h-1.5 w-14 bg-purple-300 mt-2 rounded-full" />
                    </View>
                </View>

                <Text className="text-lg text-gray-700 mb-6 leading-7 pl-2">
                    {tips[currentTip].description}
                </Text>

                <View className="flex-row justify-center space-x-6">
                    {tips.map((_, index) => (
                        <View
                            key={index}
                            className={`h-3 rounded-full ${index === currentTip ? 'bg-purple-600 w-7' : 'bg-purple-100 w-3'}`}
                        />
                    ))}
                </View>
            </Animated.View>
        </View>
    );
};

export default DriverTips;