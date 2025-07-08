import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ably } from "@/lib/ably";
import { DriverStore, LocationStore, MarkerData } from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,

  // ✅ NUEVO: tipo de grúa
  truckType: null,
  setTruckType: (type: string) => set(() => ({ truckType: type })),

  setUserLocation: ({ latitude, longitude, address }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },

  setDestinationLocation: ({ latitude, longitude, address }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
}));


export const useDriverStore = create<DriverStore>((set, get) => ({
  drivers: [] as MarkerData[],
  selectedDriver: null,
  isDriver: false, // Estado que indica si es conductor
  isAvailable: false, // Estado de disponibilidad

  setSelectedDriver: (driverId: number) => set(() => ({ selectedDriver: driverId })),

  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),

  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),

  setIsDriver: (value: boolean) => set(() => ({ isDriver: value })),

  // Nueva acción para manejar la disponibilidad (sin Ably)
  toggleAvailable: async () => {
    const { isAvailable } = get();
    const newState = !isAvailable;

    set({ isAvailable: newState });
    console.log(`Estado de disponibilidad cambiado a: ${newState ? "Conectado" : "Desconectado"}`);

    // Guardamos la disponibilidad en AsyncStorage
    await AsyncStorage.setItem("driver-availability", JSON.stringify(newState));
  },

  // Inicializamos la disponibilidad del conductor desde AsyncStorage
  initAvailability: async () => {
    const stored = await AsyncStorage.getItem("driver-availability");
    if (stored === "true") {
      set({ isAvailable: true });
    }
  },
}));
