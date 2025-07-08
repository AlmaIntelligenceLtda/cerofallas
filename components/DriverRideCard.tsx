import { View, Text } from "react-native";
import { Ride } from "@/types/type";

const DriverRideCard = ({ ride }: { ride: Ride }) => {
    return (
        <View className="bg-white p-4 mb-4 rounded-2xl shadow-md">
            <Text className="text-lg font-JakartaBold mb-1">
                {ride.origin_address} ➜ {ride.destination_address}
            </Text>
            <Text className="text-sm text-neutral-600">
                Distancia estimada: {ride.distance_km ?? "?"} km
            </Text>
        </View>
    );
};

export default DriverRideCard;