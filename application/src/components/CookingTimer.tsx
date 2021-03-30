import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import {
  getMinutesTo,
  getSecondsTo,
  clearIntervalOrUndefined,
  clearTimeoutOrUndefined,
} from "../utils";

const TIME_FINSIHED_TEXT = "Klar";
const ICON_SIZE = 33;
const NOTIFICATTION_DOT_SIZE = ICON_SIZE / 3;

type Props = {
  onPress?: () => void;
  finish: Date | undefined;
  displayRemainingTime: "hidden" | "shown" | "hiddenUntilLow";
};

export const CookingTimer = ({
  onPress,
  finish,
  displayRemainingTime,
}: Props) => {
  if (finish) {
    const [timeText, setTimeText] = useState("");
    const [timerFinished, setTimerFinished] = useState(false);

    useEffect(() => {
      let timeTextUpdateInterval: NodeJS.Timeout | undefined,
        startTimeTextUpdateTimeout: NodeJS.Timeout | undefined = undefined;
      // när timern är klar kommer timern fatta att det genom att sätta timerFinished
      const timerFinishedTimeout = setTimeout(() => {
        clearIntervalOrUndefined(timeTextUpdateInterval);
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
          if (!timeUntilDisplayTimeText) {
            setTimeText(finishTimeText(finish));
          }
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
  } else {
    return <></>;
  }
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
export const finishTimeText = (finish: Date) =>
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
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  notificationContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  notificationDot: {
    borderRadius: NOTIFICATTION_DOT_SIZE / 2,
    width: NOTIFICATTION_DOT_SIZE,
    height: NOTIFICATTION_DOT_SIZE,
    overflow: "hidden",
  },
  notificationDotVisable: {
    backgroundColor: "red",
  },
  notificationDotInvisable: {},
});
