import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { Driver, MarkerData } from "@/types/type";

import { generateMarkersFromData, calculateRegion } from "../lib/map";

const drivers: Driver[] = [
  {
    id: "1",
    first_name: "James",
    last_name: "Wilson",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: "4.80",
    bid_price: 2000.2,
    estimated_arrival_time: 5, // in minutes
  },
  {
    id: "2",
    first_name: "David",
    last_name: "Brown",
    profile_image_url:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    bid_price: 3500.34,
    car_seats: 5,
    rating: "4.60",

    estimated_arrival_time: 8,
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Johnson",
    profile_image_url:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    car_seats: 4,
    rating: "4.70",
    bid_price: 569,
    estimated_arrival_time: 3,
  },
  {
    id: "4",
    first_name: "Robert",
    last_name: "Green",
    profile_image_url:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    car_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    car_seats: 4,
    rating: "4.90",
    bid_price: 2700,
    estimated_arrival_time: 6,
  },
];

const Map = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude: userLocation.latitude,
        userLongitude: userLocation.longitude,
      });
      setMarkers(newMarkers);
    }
  }, [userLocation]);

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user location...</Text>
      </View>
    );
  }

  const region = calculateRegion({
    userLatitude: userLocation.latitude,
    userLongitude: userLocation.longitude,
  });

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Map;
