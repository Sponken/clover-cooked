/**
 * App.tsx motsvarar "main"
 * Försök att inte skriva kod i App som hade kunnat skrivas i src
 */
import "react-native-gesture-handler";
import React from "react";

import { Navigator } from "./src/navigation";

export default function App() {
  return <Navigator />;
}
