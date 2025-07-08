import { TextInputProps, TouchableOpacityProps } from "react-native";

export interface Driver {
  id: number;
  clerk_id: string;
  truck_type: string;
  truck_model: string;
  max_weight_capacity: number;
  license_front_url: string;
  license_back_url: string;
  cedula_front_url: string;  // Actualizado
  cedula_back_url: string;   // Actualizado
  profile_image_url?: string;
  rating?: number;
  current_latitude: number;
  current_longitude: number;
  rut_number: string;  // Nuevo campo para el RUT
}

export interface MarkerData {
  id: string;
  clerk_id: string;
  latitude: number;
  longitude: number;
  title: string;
  profile_image_url?: string;
  rating?: number;
  time?: number;
  price?: number; // Cambiado a number
  distance?: string;
  max_weight_capacity: number;
}

export interface MapProps {
  destinationLatitude?: number;
  destinationLongitude?: number;
  onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
  selectedDriver?: string | null;
  onMapReady?: () => void;
}

export interface Ride {
  origin_address: string;
  destination_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  ride_time: number;
  fare_price: number;
  payment_status: string;
  driver_id: string;
  user_id: string;
  created_at: string;
  driver: {
    truck_type: string;
    truck_model: string;
    max_weight_capacity: number;
    profile_image_url?: string;
  };
}

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  className?: string;
}

export interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

export interface PaymentProps {
  fullName: string;
  email: string;
  amount: string;
  driverId: string;
  rideTime: number;
}

export interface LocationStore {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  // 👇 Agrega esto
  truckType: string | null;
  setTruckType: (type: string) => void;

  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export interface DriverStore {
  drivers: MarkerData[];
  selectedDriver: string | null;  // Permite ser string o null
  setSelectedDriver: (driverId: string | null) => void; // Cambiado para aceptar null
  setDrivers: (drivers: MarkerData[]) => void;
  clearSelectedDriver: () => void;
  isDriver: boolean;
  setIsDriver: (value: boolean) => void;
}

export interface DriverCardProps {
  item: MarkerData;
  selected: string | null;
  setSelected: () => void;
}

export interface TripDetails {
  origin: string;
  destination: string;
  fare: number;
  time: number;
  distance: string;
  lat: number;
  lng: number;
  destLat: number;
  destLng: number;
}

export interface TripRequest {
  currentIndex: number;
  fromUserId: string;
  tripDetails: TripDetails;
  toDriverIds: string[];
}
