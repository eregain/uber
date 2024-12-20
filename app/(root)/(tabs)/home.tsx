import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleTextInput from "../../../components/GoogleTextInput";
import Map from "../../../components/Map";
import { icons } from "../../../constants";
import { useLocationStore } from "../../../store";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState("Fetching location...");
  const [fare, setFare] = useState("");
  const {
    setUserLocation,
    setDestinationLocation,
    setVehicleType,
    vehicleType,
  } = useLocationStore();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        const fullAddress =
          address[0]?.name +
          ", " +
          address[0]?.city +
          ", " +
          address[0]?.region;
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: fullAddress || "Current Location",
        });
        setCurrentAddress(fullAddress || "Current Location");
        setHasPermission(true);
        setLoadingLocation(false);
      } else {
        setHasPermission(false);
        setLoadingLocation(false);
      }
    } catch (err) {
      console.warn(err);
      setHasPermission(false);
      setLoadingLocation(false);
    }
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  if (loadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#79e8dd" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.mapContainer}>
            <Map />
          </View>
          <View style={styles.overlayContainer}>
            <ScrollView>
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeText}>Hi, {user?.firstName}!</Text>
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={() => signOut()}
                >
                  <Image
                    source={require("../../../assets/icons/out.png")}
                    style={styles.signOutIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.bannerContainer}>
                <Text style={styles.bannerTitle}>Current Location</Text>
                <Text style={styles.bannerText}>{currentAddress}</Text>
              </View>

              <GoogleTextInput
                icon={icons.search}
                containerStyle={styles.inputContainer}
                handlePress={handleDestinationPress}
              />

              <View style={styles.offerPriceContainer}>
                <TextInput
                  style={styles.offerPriceInput}
                  placeholder="Enter offer price"
                  placeholderTextColor="#999"
                  value={fare}
                  onChangeText={setFare}
                  keyboardType="numeric"
                />
                <TouchableOpacity style={styles.offerPriceButton}>
                  <Image
                    source={require("../../../assets/icons/dollar.png")}
                    style={styles.offerPriceIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.featureSection}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    vehicleType === "car" && styles.selectedOption,
                  ]}
                  onPress={() => setVehicleType("car")}
                >
                  <Image
                    source={require("../../../assets/icons/marker.png")}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.optionText}>Car</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.option,
                    vehicleType === "tricycle" && styles.selectedOption,
                  ]}
                  onPress={() => setVehicleType("tricycle")}
                >
                  <Image
                    source={require("../../../assets/icons/selected-marker.png")}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.optionText}>Tricycle</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1c1c1c",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  signOutButton: {
    padding: 10,
  },
  signOutIcon: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
  },
  bannerContainer: {
    backgroundColor: "#FFE59E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1c1c",
    marginBottom: 4,
  },
  bannerText: {
    color: "#1c1c1c",
    fontSize: 14,
  },
  inputContainer: {
    backgroundColor: "#2E2E2E",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  offerPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    borderRadius: 10,
    marginBottom: 16,
  },
  offerPriceInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
  },
  offerPriceButton: {
    padding: 12,
    backgroundColor: "#79e8dd",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  offerPriceIcon: {
    width: 24,
    height: 24,
    tintColor: "#1c1c1c",
  },
  featureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  option: {
    backgroundColor: "#2E2E2E",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  selectedOption: {
    backgroundColor: "#79e8dd",
  },
  featureIcon: {
    width: 30,
    height: 30,
    tintColor: "#fff",
    marginBottom: 8,
  },
  optionText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c1c1c",
  },
});

export default Home;
