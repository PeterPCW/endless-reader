import { View, Text } from "react-native";
import { Slot } from "expo-router";

export default function App() {
  return (
    <View>
      <Text>Hello, Expo!</Text>
      <Slot />
    </View>
  );
}
