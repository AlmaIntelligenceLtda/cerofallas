import { Driver, MarkerData } from "@/types/type";

/**
 * Genera marcadores de mapa basados en la ubicación real de los conductores.
 */
export function generateMarkersFromData({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] {
  return data.map((driver) => ({
    id: driver.id,
    clerk_id: driver.clerk_id,
    latitude: driver.current_latitude,
    longitude: driver.current_longitude,
    title:
      driver.truck_type && driver.truck_model
        ? `${driver.truck_type} (${driver.truck_model})`
        : "Grúa disponible",
    profile_image_url: driver.profile_image_url || "",
    rating: driver.rating ?? 0,
    max_weight_capacity: driver.max_weight_capacity ?? 0,
    price: driver.price, // puedes dejarlo si ya viene desde el backend
    time: driver.time,   // puedes dejarlo si ya viene desde el backend
    distance: driver.distance,
    car_image_url: driver.car_image_url || "",
  }));
}

/**
 * Calcula la región del mapa para centrar y hacer zoom automáticamente.
 */
export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3;
  const longitudeDelta = (maxLng - minLng) * 1.3;

  const latitude = (userLatitude + destinationLatitude) / 2;
  const longitude = (userLongitude + destinationLongitude) / 2;

  return {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

/**
 * Calcula el precio estimado y el tiempo de llegada por cada conductor.
 */

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  )
    return;

  try {
    const tarifaBase = 20000; // CLP
    const precioPorKm = 1200; // CLP

    const timesPromises = markers.map(async (marker) => {
      // Conductor → Usuario
      const responseToUser = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
      );
      const dataToUser = await responseToUser.json();
      const distanceToUser = dataToUser.routes[0].legs[0].distance.value;
      const timeToUser = dataToUser.routes[0].legs[0].duration.value;

      // Usuario → Destino
      const responseToDestination = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
      );
      const dataToDestination = await responseToDestination.json();
      const distanceToDestination =
        dataToDestination.routes[0].legs[0].distance.value;
      const timeToDestination =
        dataToDestination.routes[0].legs[0].duration.value;

      // Distancia total y tiempo estimado
      const totalDistanceKm = (distanceToUser + distanceToDestination) / 1000;
      const priceCLP = Math.round(tarifaBase + totalDistanceKm * precioPorKm);
      const totalTimeMinutes = (timeToUser + timeToDestination) / 60;

      return {
        ...marker,
        time: totalTimeMinutes,
        distance: totalDistanceKm.toFixed(2),
        price: priceCLP,
      };
    });

    return await Promise.all(timesPromises);
  } catch (error) {
    console.error("Error calculating driver times and prices:", error);
  }
};
