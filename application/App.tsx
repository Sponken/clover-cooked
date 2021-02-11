/**
 * App.tsx motsvarar "main"
 * Försök att inte skriva kod i App som hade kunnat skrivas i src
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Home } from './src/screens';

export default function App() {
  return (
    <SafeAreaProvider>
      <Home/>
    </SafeAreaProvider>
  );
}
