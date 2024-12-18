import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLocationStore } from '../store';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;


interface GoogleTextInputProps {
  icon: any;
  containerStyle?: string;
  handlePress: (location: { latitude: number; longitude: number; address: string }) => void;
}

const GoogleTextInput: React.FC<GoogleTextInputProps> = ({
  icon,
  containerStyle,
  handlePress,
}) => {
  const [searchText, setSearchText] = useState('');
  const { setDestinationLocation } = useLocationStore();

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const location = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          address: data[0].display_name,
        };
        setDestinationLocation(location);
        handlePress(location);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  return (
    <View className={`flex-row items-center ${containerStyle}`}>
      <TextInput
        placeholder="Where to?"
        className="flex-1 h-16 px-8 "
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

