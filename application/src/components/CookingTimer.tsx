import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import React, { useState, useEffect } from "react";
import {
  getMinutesTo,
  getSecondsTo,
  clearIntervalOrUndefined,
  clearTimeoutOrUndefined,
} from "../utils";

const TIME_FINSIHED_TEXT = "00:00";

type Props = {
  onPress?: () => void;
  finish?: Date;
  displayRemainingTime: "hidden" | "shown" | "hiddenUntilLow";
  size?: "small" |  "large";
  onTimerComplete?: ()=>void
};


/**
 * Komponent som visar timer för Cooking skärmen
 * Tar ett antal argument:
 *   onPress: en funktion som körs vid tryck på timern. 
 *   finish: slut date för timern om det utelämnas så visas ej timern.
 *   displayRemainingTime: ett läge för visning av tid där "hidden" döljer tiden, "shown" visar tiden och "hiddenUntilLow" visar tiden när
 *    det återstår en minut eller mindre.
 *   size: läge för storlek på timern, om utelämnas är default "small".
 */
export const CookingTimer = ({
  onPress: onPressArg,
  finish: finishArg,
  displayRemainingTime: displayRemainingTimeArg,
  size: sizeArg,
  onTimerComplete
}: Props) => {
  if (finishArg) {
    const [onPress, setOnPress] = useState(() => onPressArg);
    const [finish, setFinish] = useState(finishArg);
    const [displayRemainingTime, setDisplayRemainingTime] = useState(
      displayRemainingTimeArg
    );
    const [size, setSize] = useState(
      sizeArg ?? "small"
    );

    // Uppdaterar värdena om argumenten förändrass från parent komponent
    useEffect(() => setOnPress(() => onPressArg), [onPressArg]);
    useEffect(() => setFinish(finishArg), [finishArg]);
    useEffect(() => setDisplayRemainingTime(displayRemainingTimeArg), [
      displayRemainingTimeArg,
    ]);
    useEffect(() => setSize(sizeArg ?? "small"), [sizeArg]);

    const [timeText, setTimeText] = useState("");
    const [timerFinished, setTimerFinished] = useState(false);

    // Uppdaterar timer värden om finish, setDisplayRemainingTime förändras
    useEffect(() => {
      let timeTextUpdateInterval: NodeJS.Timeout | undefined,
        startTimeTextUpdateTimeout: NodeJS.Timeout | undefined = undefined;
      // När timern är klar kommer notis visas genom att sätta timerFinished
      const timerFinishedTimeout = setTimeout(() => {
        clearIntervalOrUndefined(timeTextUpdateInterval);
        if (displayRemainingTime !== "hidden") {
          setTimeText(TIME_FINSIHED_TEXT);
          onTimerComplete?onTimerComplete():""
        }
        setTimerFinished(true);
      }, finish.getTime() - Date.now());
      // Om det finns en timer som inte är klar kommer röda notisen inte visas, genom att sätta timerFinished
      if (finish.getTime() > Date.now()) {
        setTimerFinished(false);
      }

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
    }, [finish, setDisplayRemainingTime]);

    return (
      //<Pressable onPress={onPress} style={styles.container}>
        <View style={styles.container}>
          <Text style={[timeText === TIME_FINSIHED_TEXT ? {color: "red"} : {color: "black"}, size === "large" ? {fontSize: 50} : {fontSize: 24}]}>{timeText}</Text>
        </View>
      //</Pressable>
    );
  } else {
    return <></>;
  }
};


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
  container: { 
    alignItems: "center",
    flexDirection: "row", 
   
    

  },
  
});
