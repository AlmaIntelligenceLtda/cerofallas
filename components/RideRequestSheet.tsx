import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { Ride } from "@/types/type";
import { acceptRide, rejectRide } from "@/lib/rideActions";

type Props = {
    ride: Ride;
    onDismiss: () => void;
};

const RideRequestSheet = ({ ride, onDismiss }: Props) => {
    const sheetRef = useRef<BottomSheet>(null);
    const [secondsLeft, setSecondsLeft] = useState(5);

    useEffect(() => {
        sheetRef.current?.expand();

        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            rejectRide(ride.id);
            onDismiss();
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    const handleAccept = async () => {
        await acceptRide(ride.id);
        onDismiss();
    };

    return (
        <BottomSheet ref={sheetRef} snapPoints={["40%"]}>
            <View className="p-5">
                <Text className="text-lg font-JakartaBold mb-2">¡Nueva solicitud!</Text>
                <Text className="text-base mb-1">
                    Origen: {ride.origin_address}
                </Text>
                <Text className="text-base mb-1">
                    Destino: {ride.destination_address}
                </Text>

                <Text className="text-sm text-neutral-500 mt-2 mb-4">
                    Aceptar en {secondsLeft} segundos...
                </Text>

                <TouchableOpacity
                    className="bg-green-600 p-3 rounded-xl"
                    onPress={handleAccept}
                >
                    <Text className="text-white text-center font-JakartaBold">Aceptar traslado</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};

export default RideRequestSheet;