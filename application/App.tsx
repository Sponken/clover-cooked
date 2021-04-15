/**
 * App.tsx motsvarar "main"
 * Försök att inte skriva kod i App som hade kunnat skrivas i src
 */
import "react-native-gesture-handler";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { Navigator } from "./src/navigation";
import { LogBox } from "react-native";
import { schedulerContext } from "./src/screens/scheduler-context";
import { Scheduler } from "./src/scheduler";
//
LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {

  const [scheduler, setscheduler] = useState<Scheduler>();
  return (
    <schedulerContext.Provider value={{scheduler: scheduler, setScheduler: (newScheduler) => { setscheduler(newScheduler) }}}>
      <SafeAreaProvider>
        <Navigator />
      </SafeAreaProvider>
    </schedulerContext.Provider>
  );
}
