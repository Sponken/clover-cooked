/**
 * App.tsx motsvarar "main"
 * Försök att inte skriva kod i App som hade kunnat skrivas i src
 */
import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Navigator } from "./src/navigation";
import { LogBox } from "react-native";

// Fix för att inte visa error medelande varje gång en timer sätts på android
LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  return (
    <SafeAreaProvider>
      <Navigator />
    </SafeAreaProvider>
  );
}
