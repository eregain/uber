import { create } from "zustand";

import { DriverStore, LocationStore, MarkerData } from "@/types/type";

// Location Store
export const useLocationStore = create<LocationStore>((set) => ({
  userLatitude: null,
  userLongitude: null,
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,
  vehicleType: null,
  driverLatitude: null,
  driverLongitude: null,

  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // Clear the selected driver if a new user location is set
    useDriverStore.getState().clearSelectedDriver();
  },

  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // Clear the selected driver if a new destination is set
    useDriverStore.getState().clearSelectedDriver();
  },

  setVehicleType: (type: "car" | "tricycle") => set({ vehicleType: type }),
}));

// Driver Store
export const useDriverStore = create<DriverStore>((set) => ({
  drivers: [], // List of drivers with marker data
  selectedDriver: null, // Selected driver ID

  setSelectedDriver: (driverId: number) =>
    set(() => ({
      selectedDriver: driverId,
    })),

  setDrivers: (drivers: MarkerData[]) =>
    set(() => ({
      drivers,
    })),

  clearSelectedDriver: () =>
    set(() => ({
      selectedDriver: null,
    })),
}));
