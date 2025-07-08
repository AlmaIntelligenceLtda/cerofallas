import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useRideStore } from "@/store/useRideStore";

const DriverInProgressView = () => {
    const { driverRide, updateDriverStatus } = useRideStore();

    const handleCompleteRide = () => {
        if (!driverRide) return;

        // Actualiza estado a "completed"
        updateDriverStatus("completed");
        // Aquí podrías emitir a Ably u otro sistema para informar que el viaje terminó
        console.log("✅ Viaje marcado como completado.");
    };

    if (!driverRide) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-gray-600">No hay viaje en curso...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center px-6">
            <View className="bg-yellow-100 p-4 rounded-full mb-4 shadow-md">
                <FontAwesome name="location-arrow" size={32} color="#F59E0B" />
            </View>

            <Text className="text-xl font-semibold text-gray-800 mb-2">Viaje en curso</Text>
            <Text className="text-gray-700 mb-1">Cliente: {driverRide.passengerName || "Desconocido"}</Text>
            <Text className="text-gray-700 mb-1">Desde: {driverRide.origin}</Text>
            <Text className="text-gray-700 mb-1">Hasta: {driverRide.destination}</Text>
            <Text className="text-lg font-bold mt-2 text-purple-600">${driverRide.price}</Text>

            <TouchableOpacity
                className="mt-6 bg-green-500 py-4 px-8 rounded-full shadow"
                onPress={handleCompleteRide}
                activeOpacity={0.85}
            >
                <View className="flex-row items-center space-x-2">
                    <MaterialIcons name="check-circle" size={20} color="white" />
                    <Text className="text-white font-bold text-lg">Finalizar Viaje</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default DriverInProgressView;
