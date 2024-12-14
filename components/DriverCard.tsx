import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { icons } from "../constants";

const DriverCard = ({ item, selected, setSelected }) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between p-4 mb-4 rounded-lg ${
        selected === item.id ? "bg-blue-100" : "bg-white"
      }`}
      onPress={() => setSelected(item.id)}
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.profile_image_url }}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-bold">{`${item.first_name} ${item.last_name}`}</Text>
          <View className="flex-row items-center">
            <Image source={icons.star} className="w-4 h-4 mr-1" />
            <Text>{item.rating}</Text>
          </View>
          <Text>{`${item.car_seats} seats`}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-lg font-bold">${item.bid_price.toFixed(2)}</Text>
        <Text>{`${item.estimated_arrival_time} mins`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DriverCard;
