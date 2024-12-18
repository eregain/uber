import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import GoogleTextInput from "../../../components/GoogleTextInput";
import Map from "../../../components/Map";
import RideCard from "../../../components/RideCard";
import { icons, images } from "../../../constants";
import { useFetch } from "../../../lib/fetch";
import { useLocationStore } from "../../../store";
import { Ride } from "../../../types/type";
import { mockDrivers } from "../../../constants/mockDrivers";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [rides, setRides] = useState<Ride[]>([]);
  const [destination, setDestination] = useState("");
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { data, isLoading } = useFetch<Ride[]>("/api/rides");

  useEffect(() => {
    setRides(data || []);
  }, [data]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: "Current Location",
        });
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="px-5 py-3">
        <Text className="text-2xl font-bold">Welcome, {user?.firstName}!</Text>
        <TouchableOpacity onPress={() => signOut()} className="mt-2">
          <Text className="text-blue-500">Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 300 }}>
        <Map />
      </View>
      <GoogleTextInput
        icon={icons.search}
        containerStyle="bg-white shadow-md shadow-neutral-300 mx-5 mt-3"
        handlePress={handleDestinationPress}
      />
      <FlatList
        data={mockDrivers}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-3 border-b border-gray-200">
            <Image
              source={{ uri: item.profile_image_url }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View className="ml-3">
              <Text className="font-bold">{`${item.first_name} ${item.last_name}`}</Text>
              <Text>{`Rating: ${item.rating}, Seats: ${item.car_seats}`}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        className="px-5"
      />
    </SafeAreaView>
  );
};

export default Home;
