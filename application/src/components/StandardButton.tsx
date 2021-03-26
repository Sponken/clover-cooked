import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Pressable,
} from "react-native";

type StandardButtonProps = {
  onPress: () => void;
  buttonText: String;
};

export function StandardButton({ ...props }: StandardButtonProps) {
  return (
    <View>
      <TouchableHighlight
        style={styles.touchableHighlight}
        onPress={props.onPress}
      >
        <View style={styles.buttonStyle}>
          <Text style={styles.buttonText}>{props.buttonText}</Text>
        </View>
      </TouchableHighlight>

      <Pressable onPress={props.onPress}>
        {({ pressed }) => {
          let buttonColor = pressed
            ? { backgroundColor: "hotpink" }
            : { backgroundColor: "#b376ab" };
          return (
            <View style={[styles.buttonStyle, buttonColor]}>
              <Text style={styles.buttonText}>{props.buttonText}</Text>
            </View>
          );
        }}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  touchableHighlight: {
    borderRadius: 5,
    margin: 10,
  },
  buttonPressed: {
    backgroundColor: "#b376ab",
  },
  buttonNotPressed: {
    backgroundColor: "hotpink",
  },
  buttonStyle: {
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
  },
});
