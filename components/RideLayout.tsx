import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/Map"; // Mapa para el cliente
import MapDriver from "@/components/MapDriver"; // Mapa para el conductor
import { icons } from "@/constants";
import { MarkerData } from "@/types/type";

interface RideLayoutProps {
  snapPoints?: string[];
  children: React.ReactNode;
  scrollable?: boolean;
  markers?: MarkerData[];
  mode?: "client" | "driver";  // Identificador del modo (cliente o conductor)
}

const RideLayout = ({
  snapPoints = ["30%", "50%", "80%"],
  children,
  scrollable = true,
  markers = [],
  mode = "client",  // Default a 'client', pero puede ser 'driver'
}: RideLayoutProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // ✅ Función para bajar el BottomSheet al 30%
  const handleSnapTo30 = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        {/* Contenedor del mapa */}
        <View className="h-[75%] bg-blue-500">
          {/* Mostrar el mapa correspondiente según el modo */}
          {mode === "driver" ? (
            <MapDriver />
          ) : (
            <Map markers={markers} onDriverSelected={handleSnapTo30} />
          )}
        </View>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          index={1}
        >
          {scrollable ? (
            <BottomSheetScrollView
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 60,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </BottomSheetScrollView>
          ) : (
            <BottomSheetView style={{ flex: 1, padding: 20 }}>
              {children}
            </BottomSheetView>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RideLayout;
