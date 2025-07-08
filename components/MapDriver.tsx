import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants";
import { calculateRegion } from "@/lib/map";
import { useTripStore } from "@/store/useTripStore";
import DriverTips from "@/components/DriverTips";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const MapDriver = () => {
    const mapRef = useRef<MapView>(null);
    const { originLat, originLng, destLat, destLng } = useTripStore();

    // Calcular región basada en origen y destino
    const region = calculateRegion({
        userLatitude: originLat,
        userLongitude: originLng,
        destinationLatitude: destLat,
        destinationLongitude: destLng,
    });

    // Auto centrado cuando cambian las coordenadas
    useEffect(() => {
        if (mapRef.current && originLat && originLng) {
            mapRef.current.animateToRegion(region as Region, 800);
        }
    }, [originLat, originLng, destLat, destLng]);

    // Mostrar loading si no hay coordenadas del conductor
    if (!originLat || !originLng) {
        return <DriverTips />;
    }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider={PROVIDER_DEFAULT}
                showsUserLocation={false} // Desactivado ya que mostramos marcador personalizado
                userInterfaceStyle="light"
                region={region}
            >
                {/* Marcador del conductor/origen */}
                <Marker
                    key="driver"
                    coordinate={{
                        latitude: originLat,
                        longitude: originLng,
                    }}
                    title="Tu ubicación"
                    image={icons.car} // Usar un icono de auto para el conductor
                />

                {/* Mostrar destino solo si existe */}
                {destLat && destLng && (
                    <>
                        <Marker
                            key="destination"
                            coordinate={{
                                latitude: destLat,
                                longitude: destLng,
                            }}
                            title="Destino"
                            image={icons.pin}
                        />
                        <MapViewDirections
                            origin={{
                                latitude: originLat,
                                longitude: originLng,
                            }}
                            destination={{
                                latitude: destLat,
                                longitude: destLng,
                            }}
                            apikey={directionsAPI!}
                            strokeColor="#3da0e2"
                            strokeWidth={4} // Más grueso para mejor visibilidad
                            onReady={() => {
                                // Ajustar el mapa para mostrar toda la ruta
                                mapRef.current?.fitToCoordinates(
                                    [
                                        { latitude: originLat, longitude: originLng },
                                        { latitude: destLat, longitude: destLng },
                                    ],
                                    {
                                        edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
                                        animated: true,
                                    }
                                );
                            }}
                        />
                    </>
                )}
            </MapView>
        </View>
    );
};

export default MapDriver;