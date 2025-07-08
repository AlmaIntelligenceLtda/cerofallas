import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRideStore } from "@/store/useRideStore";

const DriverCompletedView = () => {
    const { driverRide, clearRides } = useRideStore();

    const handlePayment = () => {
        // Aquí podrías redirigir a una pantalla de pago o emitir el estado final a Ably
        console.log("💰 Iniciar proceso de pago");
        clearRides(); // Limpiar estado y volver a estado idle
    };

    if (!driverRide) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-gray-600">No hay datos del viaje finalizado.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center px-6">
            <View className="bg-green-100 p-4 rounded-full mb-4 shadow-md">
                <FontAwesome name="check-circle" size={32} color="#10B981" />
            </View>

            <Text className="text-xl font-semibold text-gray-800 mb-2">¡Viaje finalizado!</Text>
            <Text className="text-gray-700 mb-1">Desde: {driverRide.origin}</Text>
            <Text className="text-gray-700 mb-1">Hasta: {driverRide.destination}</Text>
            <Text className="text-lg font-bold mt-2 text-purple-600">${driverRide.price}</Text>

            <TouchableOpacity
                className="mt-6 bg-purple-600 py-4 px-8 rounded-full shadow"
                onPress={handlePayment}
                activeOpacity={0.85}
            >
                <View className="flex-row items-center space-x-2">
                    <MaterialIcons name="payment" size={20} color="white" />
                    <Text className="text-white font-bold text-lg">Cobrar viaje</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default DriverCompletedView;
