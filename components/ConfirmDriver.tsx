import { useAuth } from "@clerk/clerk-expo";
import React, { useCallback, useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import CustomButton from "@/components/CustomButton";
import { useLocationStore } from "@/store";
import { useRideDispatch } from "@/hooks/useRideDispatch";
import { useRideConfirmation } from "@/hooks/useRideConfirmation";  // Importar el hook
import { RideRequest } from "@/types/ride";
import { useRouter } from "expo-router";  // Usar expo-router para la navegación

type Props = {
    rideTime: number;
    driver: {
        id: number;
        clerk_id: string;
        price: number;
        distance: string;
    };
};

const ConfirmDriver = ({ rideTime, driver }: Props) => {
    const router = useRouter();
    const {
        userAddress,
        destinationAddress,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    } = useLocationStore();

    const { userId } = useAuth();
    const { sendRideRequest } = useRideDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [showCancelButton, setShowCancelButton] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    // Función que se ejecuta cuando el viaje es aceptado
    const handleRideAccepted = (driverId: string) => {
        setIsLoading(false);
        setShowCancelButton(false);

        // Limpiar el timeout si existe
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        router.push("/(root)/client-ride-status")

    };

    // Usar el hook para escuchar la aceptación del conductor
    // Esto debe estar fuera del useEffect y directamente en el componente
    useRideConfirmation(userId, handleRideAccepted);  // Escuchar la confirmación

    // Efecto para manejar el timeout de cancelación
    useEffect(() => {
        return () => {
            // Limpiar el timeout al desmontar el componente
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    // Confirmar la solicitud de viaje
    const handleConfirm = useCallback(async () => {
        if (!userId) {
            console.warn("❌ Usuario no autenticado.");
            return;
        }

        console.log("Datos del conductor: ", driver);

        if (!driver?.clerk_id) {
            console.warn("❌ El conductor no tiene asociado un Clerk ID.");
            return;
        }

        setIsLoading(true);

        // Configurar el timeout para mostrar el botón de cancelación después de 7 segundos
        const id = setTimeout(() => {
            setShowCancelButton(true);
        }, 7000);

        setTimeoutId(id);

        const payload: RideRequest = {
            fromUserId: userId,
            toDriverIds: [driver.clerk_id],
            currentIndex: 0,
            rideDetails: {
                origin: userAddress!,
                destination: destinationAddress!,
                lat: userLatitude!,
                lng: userLongitude!,
                destLat: destinationLatitude!,
                destLng: destinationLongitude!,
                fare: driver.price,
                distance: driver.distance,
                time: rideTime,
            },
        };

        await sendRideRequest(payload);
        console.log("✅ Solicitud enviada. Esperando respuesta del conductor...");
    }, [
        userId,
        driver,
        userAddress,
        destinationAddress,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
        rideTime,
    ]);

    const handleCancel = () => {
        // Limpiar el timeout si existe
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        setIsLoading(false);
        setShowCancelButton(false);
        router.back(); // Retroceder en la navegación
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {isLoading ? (
                <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#6B21A8" />
                    <Text style={{ marginTop: 20, fontSize: 16 }}>Esperando respuesta del conductor...</Text>
                </View>
            ) : (
                <CustomButton
                    title="Enviar solicitud de traslado"
                    className="my-10"
                    onPress={handleConfirm}
                />
            )}

            {showCancelButton && (
                <CustomButton
                    title="Cancelar solicitud"
                    className="mt-4 bg-gray-500"
                    onPress={handleCancel}
                />
            )}
        </View>
    );
};

export default ConfirmDriver;
