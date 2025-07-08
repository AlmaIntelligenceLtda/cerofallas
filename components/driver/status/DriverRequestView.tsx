// components/driver/status/DriverRequestView.tsx

import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Animated, Easing, ActivityIndicator } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRideRequest } from "@/hooks/useRideRequest";
import { useRideAcceptance } from "@/hooks/useRideAcceptance";
import { useTripStore } from "@/store/useTripStore";
import { useRideStore } from "@/store/useRideStore";

const DriverRequestView = () => {
    const [request, setRequest] = useState<any>(null);
    const { user } = useUser();
    const { updateTripDetails, resetTripDetails } = useTripStore();
    const { acceptRide } = useRideAcceptance();
    const { updateDriverStatus, setDriverRide } = useRideStore();

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (request) {
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

            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.out(Easing.back(1.2)),
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            slideAnim.setValue(300);
            fadeAnim.setValue(0);
        }
    }, [request]);

    useRideRequest((data) => {
        console.log("📥 Solicitud recibida:", data);
        setRequest(data);

        setTimeout(() => {
            setRequest((prev) => {
                if (prev?.fromUserId === data.fromUserId) {
                    console.log("⏱️ Solicitud expirada:", data.fromUserId);
                    resetTripDetails();
                    return null;
                }
                return prev;
            });
        }, 15000);
    });

    useEffect(() => {
        if (!request) {
            resetTripDetails();
            return;
        }

        const { lat, lng, destLat, destLng } = request.rideDetails;

        if ([lat, lng, destLat, destLng].some(coord => coord === null || isNaN(coord))) {
            console.warn("Coordenadas inválidas en la solicitud");
            return;
        }

        updateTripDetails({
            originLat: lat,
            originLng: lng,
            destLat,
            destLng,
        });

        return () => {
            resetTripDetails();
        };
    }, [request]);

    const handleAccept = async () => {
        if (!user || !request) return;

        try {
            await acceptRide(request.fromUserId, user.id);

            // Guardar viaje y pasar a estado "in_progress"
            setDriverRide({
                id: Date.now().toString(),
                passengerName: "Cliente", // Aquí podrías incluir nombre real si lo tienes
                origin: request.rideDetails.origin,
                destination: request.rideDetails.destination,
                price: request.rideDetails.fare,
                status: "in_progress",
            });

            updateDriverStatus("in_progress");

            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(pulseAnim, {
                    toValue: 0.8,
                    friction: 3,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setRequest(null);
                resetTripDetails();
            });
        } catch (error) {
            console.error("Error al aceptar viaje:", error);
        }
    };

    if (!request) {
        return (
            <View className="flex-1 items-center justify-center">
                <View className="relative">
                    <View className="absolute -inset-4 bg-blue-100 rounded-full opacity-0 animate-ping" />
                    <View className="bg-purple-100 p-6 rounded-full">
                        <FontAwesome name="car" size={40} color="#8B5CF6" />
                    </View>
                </View>
                <Text className="mt-6 text-xl font-semibold text-gray-700">Conectado</Text>
                <Text className="text-gray-500">Listo para recibir nuevos viajes</Text>
                <View className="mt-10 flex-row items-center">
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text className="text-purple-700 text-base ml-3">
                        Esperando solicitudes...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <Animated.View
            className="bg-white rounded-3xl p-6 shadow-xl"
            style={{
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 20,
            }}
        >
            <View className="flex-row items-center mb-4">
                <View className="bg-blue-100 p-3 rounded-full mr-3">
                    <FontAwesome name="user" size={24} color="#3B82F6" />
                </View>
                <Text className="text-xl font-bold text-gray-800">Nueva solicitud de transporte</Text>
            </View>

            <View className="space-y-4 mb-6">
                <View className="flex-row items-center">
                    <MaterialIcons name="location-on" size={24} color="#EF4444" />
                    <View className="ml-3">
                        <Text className="text-xs text-gray-500">Recoger en</Text>
                        <Text className="text-lg font-semibold text-gray-800">
                            {request.rideDetails.origin}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center">
                    <MaterialIcons name="location-pin" size={24} color="#10B981" />
                    <View className="ml-3">
                        <Text className="text-xs text-gray-500">Destino</Text>
                        <Text className="text-lg font-semibold text-gray-800">
                            {request.rideDetails.destination}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between">
                    <View className="flex-row items-center">
                        <MaterialIcons name="attach-money" size={20} color="#F59E0B" />
                        <Text className="ml-2 text-gray-700">${request.rideDetails.fare}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialIcons name="access-time" size={20} color="#6366F1" />
                        <Text className="ml-2 text-gray-700">{Math.round(request.rideDetails.time)} min</Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialIcons name="directions-car" size={20} color="#8B5CF6" />
                        <Text className="ml-2 text-gray-700">{request.rideDetails.distance} Km</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">Tiempo restante: 15s</Text>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity
                        className="bg-purple-500 py-4 px-8 rounded-full shadow-lg"
                        onPress={handleAccept}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-lg">Aceptar Viaje</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

export default DriverRequestView;
