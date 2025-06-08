import React from "react";
import { NavigationContainer } from "@react-navigation/native";

// Import the root navigator
import { RootNavigator } from "./src/navigators";

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
