/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";

import { useLocationStore } from "../store";

interface GoogleTextInputProps {
  icon: any;
  containerStyle?: string;
  handlePress: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

const GoogleTextInput: React.FC<GoogleTextInputProps> = ({
  icon,
  containerStyle,
  handlePress,
}) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        const location = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          address: data[0].display_name,
        };
        handlePress(location);
      } else {
        Alert.alert("No results found", "Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      Alert.alert(
        "Error",
        "Failed to search for location. Please check your internet connection and try again.",
      );
    }
  };

  return (
    <View className={`flex-row items-center ${containerStyle}`}>
      <TextInput
        placeholder="Where to?"
        className="flex-1 h-12 px-4"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch} className="p-2">
        <Image source={icon} className="w-6 h-6" />
      </TouchableOpacity>
    </View>
  );
};

export default GoogleTextInput;
