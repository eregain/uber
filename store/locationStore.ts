import { create } from "zustand";

interface LocationState {
  userLatitude: number | null;
  userLongitude: number | null;
  userAddress: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  destinationAddress: string | null;
  vehicleType: "car" | "tricycle" | null;
  setUserLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setDestinationLocation: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setVehicleType: (type: "car" | "tricycle") => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  vehicleType: null,
  setUserLocation: (location) =>
    set({
      userLatitude: location.latitude,
      userLongitude: location.longitude,
      userAddress: location.address,
    }),
  setDestinationLocation: (location) =>
    set({
      destinationLatitude: location.latitude,
      destinationLongitude: location.longitude,
      destinationAddress: location.address,
    }),
  setVehicleType: (type) => set({ vehicleType: type }),
}));
