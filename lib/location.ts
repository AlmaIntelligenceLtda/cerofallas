import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

import { fetchAPI } from '@/lib/fetch';
import { useLocationStore } from '@/store';

export const startLocationTracking = async (clerkId: string) => {
  const { setUserLocation } = useLocationStore.getState();

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return;

  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 10,
    },
    async (location: LocationObject) => {
      const coords = location.coords;
      const address = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });

      // Enviar ubicación al backend con el clerkId explícitamente
      await fetchAPI('/api/driver/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
          clerkId,
        }),
      });
    }
  );
};
