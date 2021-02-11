/**
 * Hem skärm, första skärmen som visas vid vanlig öppning av appen
 */

import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';


export function Home() {
    return (
      <View style={styles.container}>
        <Text>Hello World!</Text>
        <StatusBar style="auto" />
      </View>
    );
  }


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  