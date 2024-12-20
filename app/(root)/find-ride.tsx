import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { icons } from "@/constants";
import { mockCarDrivers, mockTricycleDrivers } from "@/constants/mockDrivers";
import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
    vehicleType,
  } = useLocationStore();

  const [mapHeight, setMapHeight] = useState("60%");
  const [from, setFrom] = useState(destinationAddress || ""); // Update: from is now initialized with destinationAddress or ''
  const [to, setTo] = useState(""); // Update: to is now initialized as an empty string
  const [availableDrivers, setAvailableDrivers] = useState([]);

  useEffect(() => {
    setMapHeight("60%");
    setAvailableDrivers(
      vehicleType === "car" ? mockCarDrivers : mockTricycleDrivers,
    );
  }, [vehicleType]);

  const handleFromPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setUserLocation(location);
    setFrom(location.address);
  };

  const handleToPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    setTo(location.address);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mapContainer, { height: mapHeight }]}>
        <Map vehicleType={vehicleType} availableDrivers={availableDrivers} />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>From</Text>
          <GoogleTextInput
            icon={icons.target}
            initialLocation={from}
            containerStyle={styles.textInput}
            handlePress={handleFromPress}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>To</Text>
          <GoogleTextInput
            icon={icons.map}
            initialLocation={to}
            containerStyle={styles.textInput}
            handlePress={handleToPress}
          />
        </View>

        <TouchableOpacity
          style={styles.findButton}
          onPress={() => router.push("/(root)/confirm-ride")}
        >
          <Text style={styles.findButtonText}>Find Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    width: "100%",
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "#1c1c1c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#fff",
  },
  textInput: {
    backgroundColor: "#3a3a3a",
    borderRadius: 8,
  },
  findButton: {
    backgroundColor: "#79e8dd",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  findButtonText: {
    color: "#1c1c1c",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FindRide;
