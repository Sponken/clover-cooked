import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

type Props = {
  onPress: () => void;
};

export const UndoButton = ({ onPress }: Props) => (
  <Pressable onPress={onPress} style={styles.container}>
    <View>
      <Image
        source={require("../../assets/image/undo.png")}
        style={styles.image}
      />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    maxWidth: "70%",
    maxHeight: "70%",
    aspectRatio: 1,
  },
});
