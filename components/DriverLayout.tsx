import BottomSheet, {
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "@/components/Map";

interface DriverHomeLayoutProps {
    title: string;
    snapPoints?: string[];
    children: React.ReactNode;
    scrollable?: boolean;
}

const DriverHomeLayout = ({
    title,
    snapPoints,
    children,
    scrollable = true,
}: DriverHomeLayoutProps) => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1 bg-white">
                {/* Mapa con encabezado */}
                <View className="flex-1">
                    <Map mode="driver" />
                    <View className="absolute top-16 left-5 z-10 bg-white/80 p-3 rounded-xl shadow">
                        <Text className="text-lg font-JakartaSemiBold">{title || "Estado del Conductor"}</Text>
                    </View>
                </View>

                {/* BottomSheet */}
                <BottomSheet snapPoints={snapPoints} index={1}>
                    {scrollable ? (
                        <BottomSheetScrollView contentContainerStyle={{ padding: 20 }}>
                            {children}
                        </BottomSheetScrollView>
                    ) : (
                        <BottomSheetView style={{ padding: 20 }}>
                            {children}
                        </BottomSheetView>
                    )}
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    );
};

export default DriverHomeLayout;
