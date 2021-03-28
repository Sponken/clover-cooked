import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import {
  getMinutesTo,
  getSecondsTo,
  clearIntervalOrUndefined,
  clearTimeoutOrUndefined,
} from "../utils";

const TIME_FINSIHED_TEXT = "Klar";

type Props = {
  onPress?: () => void;
  finish: Date;
  displayRemainingTime: "hidden" | "shown" | "hiddenUntilLow";
};

export const CookingTimer = ({
  onPress,
  finish,
  displayRemainingTime,
}: Props) => {
  const [timeText, setTimeText] = useState("");
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    let timeTextUpdateInterval: NodeJS.Timeout | undefined,
      startTimeTextUpdateTimeout: NodeJS.Timeout | undefined = undefined;
    // när timern är klar kommer timern fatta att det genom att sätta timerFinished
    const timerFinishedTimeout = setTimeout(() => {
      clearIntervalOrUndefined(timeTextUpdateInterval);
      console.log("PLUPPEN VISAS");
      if (displayRemainingTime !== "hidden") {
        setTimeText(TIME_FINSIHED_TEXT);
      }
      setTimerFinished(true);
    }, finish.getTime() - Date.now());
    let timeUntilDisplayTimeText = 0; // i ms
    switch (displayRemainingTime) {
      case "hiddenUntilLow":
        if (finish.getTime() - Date.now() > 60000) {
          timeUntilDisplayTimeText = finish.getTime() - Date.now() - 60000;
        }
      case "shown":
        startTimeTextUpdateTimeout = setTimeout(
          () =>
            // uppdaterar timern varje sekund
            (timeTextUpdateInterval = setInterval(() => {
              setTimeText(finishTimeText(finish));
            }, 1000)),
          timeUntilDisplayTimeText
        );
    }

    // unsubscribar tidsuppdateringarna och timerfinished när CookingTimer unloadas
    return () => {
      clearTimeoutOrUndefined(startTimeTextUpdateTimeout);
      clearIntervalOrUndefined(timeTextUpdateInterval);
      clearTimeout(timerFinishedTimeout);
    };
  }, []);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View>
        <Image
          source={require("../../assets/image/time_icon.png")}
          style={styles.icon}
        ></Image>
        <View style={styles.notificationContainer}>
          <Notification visable={timerFinished} />
        </View>
      </View>
      <Text>{timeText}</Text>
    </Pressable>
  );
};

type NotificationProps = {
  visable: boolean;
};

const Notification = ({ visable }: NotificationProps) => (
  <View
    style={[
      styles.notificationDot,
      visable ? styles.notificationDotVisable : styles.notificationDotInvisable,
    ]}
  />
);

/**
 *
 * @param finish Date för när timern är klar
 * @returns tids text, "Klar" om tiden har passerats
 */
const finishTimeText = (finish: Date) =>
  getMinutesTo(finish) >= 0
    ? getMinutesTo(finish)
        .toString()
        .padStart(2, "0") +
      ":" +
      (getSecondsTo(finish) % 60).toString().padStart(2, "0")
    : TIME_FINSIHED_TEXT;

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  icon: {
    height: 35,
    width: 35,
  },
  notificationContainer: {
    position: "absolute",
    right: 1,
    top: 1,
  },
  notificationDot: {
    borderRadius: 6,
    width: 12,
    height: 12,
    overflow: "hidden",
  },
  notificationDotVisable: {
    backgroundColor: "red",
  },
  notificationDotInvisable: {},
});
